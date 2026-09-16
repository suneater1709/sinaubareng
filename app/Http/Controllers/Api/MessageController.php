<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MessageController extends Controller
{
    /**
     * Get available contacts and active conversation list for the current user.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $role = $currentUser->role;

        // Determine who the user can see/contact based on role matrix
        $contactsQuery = User::where('id', '!=', $currentUser->id)
            ->where('status', 'active');

        if ($role === 'siswa') {
            // Siswa can only contact Gurus matching their jenjang (or all active gurus if jenjang matches)
            $contactsQuery->where('role', 'guru');
            if (!empty($currentUser->jenjang)) {
                $contactsQuery->where(function ($q) use ($currentUser) {
                    $q->where('jenjang', $currentUser->jenjang)
                      ->orWhereNull('jenjang');
                });
            }
        } elseif ($role === 'guru') {
            // Guru can contact Admin and Siswa of their jenjang
            $contactsQuery->where(function ($q) use ($currentUser) {
                $q->where('role', 'admin');
                $q->orWhere(function ($sub) use ($currentUser) {
                    $sub->where('role', 'siswa');
                    if (!empty($currentUser->jenjang)) {
                        $sub->where(function ($j) use ($currentUser) {
                            $j->where('jenjang', $currentUser->jenjang)
                              ->orWhereNull('jenjang');
                        });
                    }
                });
            });
        } elseif ($role === 'admin') {
            // Admin can contact all Gurus and all Siswa
            $contactsQuery->whereIn('role', ['guru', 'siswa']);
        }

        $contacts = $contactsQuery->select(['id', 'name', 'email', 'role', 'jenjang'])->get();

        // Attach last message and unread count for each contact
        $results = $contacts->map(function ($contact) use ($currentUser) {
            $lastMessage = Message::where(function ($q) use ($currentUser, $contact) {
                $q->where('sender_id', $currentUser->id)->where('receiver_id', $contact->id);
            })->orWhere(function ($q) use ($currentUser, $contact) {
                $q->where('sender_id', $contact->id)->where('receiver_id', $currentUser->id);
            })->latest()->first();

            $unreadCount = Message::where('sender_id', $contact->id)
                ->where('receiver_id', $currentUser->id)
                ->where('is_read', false)
                ->count();

            return [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'role' => $contact->role,
                'jenjang' => $contact->jenjang,
                'last_message' => $lastMessage ? [
                    'content' => $lastMessage->content,
                    'created_at' => $lastMessage->created_at,
                    'is_mine' => $lastMessage->sender_id === $currentUser->id,
                ] : null,
                'unread_count' => $unreadCount,
            ];
        });

        // Sort by most recent message or name
        $sorted = $results->sort(function ($a, $b) {
            $timeA = $a['last_message'] ? strtotime($a['last_message']['created_at']) : 0;
            $timeB = $b['last_message'] ? strtotime($b['last_message']['created_at']) : 0;
            if ($timeA === $timeB) {
                return strcmp($a['name'], $b['name']);
            }
            return $timeB <=> $timeA;
        })->values();

        return response()->json($sorted);
    }

    /**
     * Get chat thread with a specific user.
     */
    public function thread(Request $request, $otherUserId)
    {
        $currentUser = $request->user();
        $otherUser = User::findOrFail($otherUserId);

        $messages = Message::where(function ($q) use ($currentUser, $otherUserId) {
            $q->where('sender_id', $currentUser->id)->where('receiver_id', $otherUserId);
        })->orWhere(function ($q) use ($currentUser, $otherUserId) {
            $q->where('sender_id', $otherUserId)->where('receiver_id', $currentUser->id);
        })
        ->orderBy('created_at', 'asc')
        ->get();

        // Mark received messages as read
        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $currentUser->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'contact' => [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
                'email' => $otherUser->email,
                'role' => $otherUser->role,
                'jenjang' => $otherUser->jenjang,
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Send a message with strict role-matrix validation.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content'     => 'required|string|max:2000',
        ]);

        $receiver = User::findOrFail($data['receiver_id']);

        // Check sender-receiver matrix
        $senderRole = $currentUser->role;
        $receiverRole = $receiver->role;

        $isAllowed = false;

        if ($senderRole === 'siswa') {
            // Siswa can ONLY send to Guru
            if ($receiverRole === 'guru') {
                $isAllowed = true;
            }
        } elseif ($senderRole === 'guru') {
            // Guru can send to Admin and Siswa
            if (in_array($receiverRole, ['admin', 'siswa'])) {
                $isAllowed = true;
            }
        } elseif ($senderRole === 'admin') {
            // Admin can send to Guru and Siswa
            if (in_array($receiverRole, ['guru', 'siswa'])) {
                $isAllowed = true;
            }
        }

        if (! $isAllowed) {
            throw ValidationException::withMessages([
                'receiver_id' => ["Anda dengan peran '{$senderRole}' tidak memiliki izin mengirim pesan ke pengguna dengan peran '{$receiverRole}'."],
            ]);
        }

        $message = Message::create([
            'sender_id'     => $currentUser->id,
            'sender_role'   => $senderRole,
            'receiver_id'   => $receiver->id,
            'receiver_role' => $receiverRole,
            'content'       => $data['content'],
            'is_read'       => false,
        ]);

        // Automatically create in-app notification for receiver
        Notification::create([
            'user_id' => $receiver->id,
            'title'   => "Pesan baru dari {$currentUser->name}",
            'message' => mb_substr($data['content'], 0, 80) . (mb_strlen($data['content']) > 80 ? '...' : ''),
            'type'    => 'message',
            'link'    => '/messages',
            'is_read' => false,
        ]);

        return response()->json($message, 201);
    }

    /**
     * Mark thread as read.
     */
    public function markAsRead(Request $request, $otherUserId)
    {
        $currentUser = $request->user();

        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $currentUser->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Pesan telah ditandai sebagai dibaca']);
    }
}
