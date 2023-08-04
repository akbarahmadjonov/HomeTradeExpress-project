import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@components/Header/Header";
import "./Messaging.scss";
import { useRef } from "react";
// Icons
import TrashIcon from "../../../public/assets/images/messaging-delete-icon.svg";
import { BackButton } from "../../components/BackButton/BackButton";
import ChatsendIcon from "../../../public/assets/images/chatbar-send-icon.svg";
import SelectedChatImg from "../../../public/assets/images/chat-icon-home-chilonzor.webp";
import arrow from "../../../public/assets/images/left-arrow.svg";
import MessagingService from "../../Api/messaging.service";
//* Socket connection

// const token = localStorage.getItem("token");

// import { io } from "socket.io-client";
// const socket = io("https://test.uyjoybaraka.uz/", {
//   extraHeaders: {
//     authorization: token,
//   },
// });

// console.log(socket);

export const Messaging = () => {
  const mockData = [
    {
      id: 1,
      src: "../../../public/assets/images/messaging-user-icon.svg",
      name: "Umid",
      ad: "BBeruniyda 1-xonalik kvartira ijaraga studentlarga beriladi",
      message:
        "Aka biz 15 kishimiz, realniy turamiz, honada kir mashina bormi?",
      chat_started: "01.08.2022",
    },
    {
      id: 2,
      src: "../../../public/assets/images/messaging-user-icon.svg",
      name: "Qosim Abdusattorov",
      ad: "Yakkasaroyda 5-xonalik kvartira ijaraga studentlarga beriladi",
      message: "aka tel raqam tashlang?",
      chat_started: "22.08.2021",
    },
  ];
  const [isActive, setIsActive] = useState(false);
  const [isBarActive, setIsBarActive] = useState();
  const [chats, setChats] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);

  // const message = useRef(null);
  // const sendMessage = async (e) => {
  //   e.preventDefault();
  // };
  //* Handle button active state change
  const handleButtonClick = () => {
    setIsActive(!isActive);
  };

  const handleBarActive = () => {
    setIsBarActive(!isBarActive);
  };

  //* Handle chat bar active
  const handleChatBarActive = (id) => {
    setActiveChatId((prevActiveChatId) => {
      if (prevActiveChatId === id) {
        return null; //* Deactivate the chat item if it's already active
      } else {
        return id; //* Activate the clicked chat item
      }
    });
  };

  useEffect(() => {
    (async() => {
      try {
        const data = await MessagingService.GetMessaging();
        setChats(data?.members);
        // getterStSet(false);
      } catch (error) {
        console.error("Error occurred while fetching user profile", error);
      }
    })()
  }, [activeChatId]);


  console.log(chats);
  const selectedChat = chats?.find((chat) => chat.chat_id === activeChatId);
  return (
    <>
      {/* Header component */}
      <Header />
      {/* Users bar */}
      <div className="users-bar">
        <div className="container">
          <div className="backButton">
            <button onClick="" className="customBack">
              <img src={arrow} alt="arrow button" /> Orqaga
            </button>
          </div>
          <div className="bar-wrapper">
            <div
              className={`wrapper-sections ${
                isBarActive ? "isBarActive" : "d-block"
              }`}
            >
              <div className="layoutButtons">
                {/* Layout buttons */}
                <button
                  className={`layout-buttons__btn ${
                    isActive ? "layout-buttons__btn" : "active"
                  }`}
                  onClick={handleButtonClick}
                >
                  Sotaman
                </button>
                <button
                  className={`layout-buttons__btn ${
                    isActive ? "active" : "layout-buttons__btn"
                  }`}
                  onClick={handleButtonClick}
                >
                  Sotib olaman
                </button>
              </div>
              {/* Delete messaging */}
              <div className="bg-chat">
                <div className="delete-bar">
                  <button className="trash-icon">
                    <img src={TrashIcon} alt="trash icon" />
                    <span className="trash-span">Delete</span>
                  </button>
                </div>
                {/* Chats */}
                {chats?.map((info) => (
                  <div key={info.chat_id} className="chats-container">
                    <div
                      className={`chat-wrapper ${
                        info.chat_id === activeChatId ? "chatActive" : ""
                      }`}
                      onClick={() => {
                        handleChatBarActive(info.chat_id);
                        handleBarActive();
                      }}
                    >
                      <div className="chat-inner">
                        <img src={`https://test.uyjoybaraka.uz/${info.user.avatar}`} width={100} alt="user image" className="member-img"/>
                      </div>
                      <div className="chat-inner chat-inner__info">
                        <div className="chat-deleting">
                          <span className="chat-user__name">{info.user.full_name}</span>
                          <button onClick={() => handleRemoveChat(info.chat_id)}>
                            <img src={TrashIcon} alt="delete chat icon" />
                          </button>
                        </div>
                        <p className="chat-user__ad">
                          {/* {info.message.substr(0, 57)} */}
                        </p>
                        <p className="chat-user__message">
                          {info.message.content.substr(0, 45)}....
                          {/* Now, it cuts texts based on user message */}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Chat section */}
            <div
              className={`chatbar-head ${isBarActive ? "d-block" : "d-block"}`}
            >
              {selectedChat && (
                <div className="chatbar-section">
                  <div className="chatbar-layoutButtons">
                    {/* Layout buttons */}
                    <div className="user-selected">
                      <div className="user-inner">
                        <img src={`https://test.uyjoybaraka.uz/${selectedChat.user.avatar}`} alt="selected user image"  width={100} />
                        <span className="user-name__selected">
                          {selectedChat.user.full_name}
                        </span>
                      </div>
                      <div className="trash-inner">
                        <button>
                          <img src={TrashIcon} alt="trash icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-chat">
                    <div className="delete-bars">
                      {selectedChat && (
                        
                        <div
                          className={`selected-chat ${
                            selectedChat.chat_id === activeChatId ? "chatActive" : ""
                          }`}
                        >
                          <img src={SelectedChatImg} alt="selected chat" />
                          <div>
                            <span className="selected-ad">
                              {selectedChat.announcement_id}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Chats */}
                    <div className="chats-container__bar">
                      <div className="chat-wrapper__bar">
                        <span className="chatbar-date">
                          {selectedChat.message.timestamp.split("T")[0].split("-").join(".")}
                        </span>
                      </div>
                    </div>
                    {/* Chat messaged mock */}
                    <div style={{ width: "200px", marginTop: "50px" }}>
                      <span className="client-ms">{selectedChat.message.content}</span>
                      {/* <span className="self-ms">{selectedChat.message}</span> */}
                    </div>
                    {/* Chat messaged mock */}
                    <input
                      type="text"
                      className="chatbar-input"
                      placeholder="Sms yozish"
                      aria-label="Enter your message(Habaringizni kiriting)"
                      // ref={message}
                    />
                    <button
                      type="submit"
                      className="chatbar-button"
                      // onClick={sendMessage}
                    >
                      <img
                        className="chatbar-send__icon"
                        src={ChatsendIcon}
                        alt="chat-send icon"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer component */}
      {/* <Footer /> */}
    </>
  );
};
