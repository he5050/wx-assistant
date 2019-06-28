import { Friendship } from "wechaty";
// 自动加好友
const onFriendShip = async friendship => {
    let logMsg;
    try {
        logMsg = "添加好友" + friendship.contact().name();
        console.log(logMsg);
        switch (friendship.type()) {
            /**
             *
             * 1. New Friend Request
             *
             * when request is set, we can get verify message from `request.hello`,
             * and accept this request by `request.accept()`
             */
            case Friendship.Type.Receive:
                await friendship.accept();
                break;
            /**
             *
             * 2. Friend Ship Confirmed
             *
             */
            case Friendship.Type.Confirm:
                logMsg = "friend ship confirmed with " + friendship.contact().name();
                break;
        }
    } catch (e) {
        logMsg = e.message;
    }
    console.log(logMsg);
};

export default onFriendShip;
