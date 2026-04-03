# ════════════════════════════════════════════════════════════
#  routes/messages.py
# ════════════════════════════════════════════════════════════
from fastapi import APIRouter, Depends, Query
from app.config.supabase import get_supabase_admin
from app.middleware.auth import get_current_user
from app.schemas.models import SendMessageRequest

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.get("/conversations")
async def get_conversations(current_user: dict = Depends(get_current_user)):
    """
    List unique conversations for the current user.
    Supabase Realtime handles live updates on the client side.
    """
    admin = get_supabase_admin()
    uid   = current_user["id"]

    # Get all messages where user is sender or receiver, ordered latest first
    result = (
        admin.table("messages")
        .select(
            "*, sender:profiles!messages_sender_id_fkey(id,name,username,avatar_url,role),"
            "receiver:profiles!messages_receiver_id_fkey(id,name,username,avatar_url,role)"
        )
        .or_(f"sender_id.eq.{uid},receiver_id.eq.{uid}")
        .order("created_at", desc=True)
        .execute()
    )

    # Deduplicate into conversations (keep latest message per pair)
    seen    = set()
    convos  = []
    for msg in result.data:
        s, r    = msg["sender_id"], msg["receiver_id"]
        pair_key = tuple(sorted([s, r]))
        if pair_key not in seen:
            seen.add(pair_key)
            # Count unread
            other_id = s if r == uid else r
            unread   = admin.table("messages").select("id", count="exact")\
                .eq("sender_id", other_id).eq("receiver_id", uid)\
                .eq("is_read", False).execute()
            msg["unread_count"] = unread.count or 0
            convos.append(msg)

    return {"success": True, "conversations": convos}


@router.get("/{other_user_id}")
async def get_chat_history(
    other_user_id: str,
    page:  int = Query(1, ge=1),
    limit: int = Query(30, le=100),
    current_user: dict = Depends(get_current_user),
):
    """Get paginated chat history between current user and another user."""
    admin  = get_supabase_admin()
    uid    = current_user["id"]
    offset = (page - 1) * limit

    result = (
        admin.table("messages")
        .select("*, sender:profiles!messages_sender_id_fkey(name,avatar_url)")
        .or_(
            f"and(sender_id.eq.{uid},receiver_id.eq.{other_user_id}),"
            f"and(sender_id.eq.{other_user_id},receiver_id.eq.{uid})"
        )
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )

    # Mark incoming messages as read
    admin.table("messages").update({"is_read": True})\
        .eq("sender_id", other_user_id).eq("receiver_id", uid).eq("is_read", False)\
        .execute()

    return {"success": True, "messages": list(reversed(result.data))}


@router.post("", status_code=201)
async def send_message(
    data: SendMessageRequest,
    current_user: dict = Depends(get_current_user),
):
    """Send a message. Supabase Realtime will push it to the receiver's client."""
    admin = get_supabase_admin()
    msg   = admin.table("messages").insert({
        "sender_id":   current_user["id"],
        "receiver_id": data.receiver_id,
        "content":     data.content,
        "is_read":     False,
    }).execute()

    return {"success": True, "message": msg.data[0]}
