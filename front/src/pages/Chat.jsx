import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import { Box } from "@chakra-ui/react";
import MyChats from '../components/Chat/MyChats';
import ChatBox from '../components/Chat/ChatBox';
ChatBox

function Chat() {
  const [fetchAgain, setFetchAgain] = React.useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {/* SideDrawer for search user profile with logout button*/}
      { user && <SideDrawer />}

      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">

        {/* latest chat listing */}
        {user && <MyChats fetchAgain={fetchAgain} />}

        {/* conversation screen */}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  )
}

export default Chat