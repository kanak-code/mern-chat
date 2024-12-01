
const Chat = require("../models/chatModel");


exports.accessChat = async (req, res) => {
    console.log("123456");
    try {
        const { userId } = req.body;
        const loggedUserId = req.user._id;

        if (!userId) {
            console.log("UserId param not sent with request");
            return res.sendStatus(400);
        }

        const chatDetails = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: loggedUserId } } }
            ]
        })
            .populate('users', '-password')
            .populate('latestMessage.sender', '-password')

            console.log('chatDetails>>>>>', chatDetails);

        if (chatDetails?.length > 0 ) {
            return res.send(chatDetails);
        } else {
            const createdChat = await Chat.create({
                chatName: "sender",
                isGroupChat: false,
                users: [loggedUserId, userId],
            });

            console.log('createdChat>>>>>', createdChat);


            const fullChat = await Chat.findOne({
                _id: createdChat._id
            }).populate("users", "-password")
            console.log('fullChat>>>>>', fullChat);

            res.status(200).json(fullChat);
        }


    } catch (error) {
        console.log('error<<<accessChat', error);
        res.status(500).json({ error: error.message });
    }
};

exports.featchChatDB = async (req, res) => {
    try {
        const loggedUserId = req.user._id;

        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage.sender", "name pic email");

        res.status(200).json(chats); // Send the populated chats

    } catch (error) {
        console.log('error<<<<featchChatDB ', error);
        res.status(500).json({ error: error.message });
    }
};

exports.createGroupChat = async (req, res) => {
    try {
        // Validate input fields
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        // Parse users and validate the array
        let users;
        try {
            users = JSON.parse(req.body.users);
        } catch (error) {
            return res.status(400).json({ message: "Invalid users data" });
        }

        // Ensure there are at least 2 users in the group
        if (users.length < 2) {
            return res.status(400).json({ message: "More than 2 users are required to form a group chat" });
        }

        // Add the current user to the group
        users.push(req.user._id);

        const createGroupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users,
            groupAdmin: req.user._id

        });

        const fullGroupChat = await Chat.findOne({
            _id: createGroupChat._id
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        // Return the full group chat data
        res.status(200).json(fullGroupChat);

    } catch (error) {
        console.log('error<<<<createGroupChat', error);
        res.status(500).json({ error: error.message });
    }
};

exports.renameGroup = async (req, res) => {
    try {
        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(updatedChat);
        }
    } catch (error) {
        console.log('error<<<<renameGroup', error);
        res.status(500).json({ error: error.message });
    }
};


exports.removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        if (chat.groupAdmin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only group admin can remove members" });
        }

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!removed) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(removed);
        }
    } catch (error) {
        console.log('error<<<<<<removeFromGroup', error);
        res.status(500).json({ error: error.message });
    }
};

exports.addInGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: "Chat Not Found" });
        }

        if (chat.groupAdmin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only group admin can add members" });
        }

        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!added) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(added);
        }
    } catch (error) {
        console.log('error<<<<addInGroup', error);
        res.status(500).json({ error: error.message });
    }
};