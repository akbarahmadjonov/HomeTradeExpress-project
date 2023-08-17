/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { useRef } from "react";
//* Ant design
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
//* Icons
import TrashIcon from "../../../public/assets/images/messaging-delete-icon.svg";
import ChatsendIcon from "../../../public/assets/images/chatbar-send-icon.svg";
import SelectedChatImg from "../../../public/assets/images/chat-icon-home-chilonzor.webp";
import arrow from "../../../public/assets/images/left-arrow.svg";
import MessagingService from "../../Api/messaging.service";
import DoubleCheck from "../../../public/assets/images/double-check_message.svg";
import {  useNavigate } from "react-router-dom";
import ProfileService from "../../Api/profile.service";
import NoData from "../../../public/assets/images/no-data.svg";
import ChatMessaging from "../../../public/assets/images/messaging-chat.svg";

export const Messaging = () => {
  const [isActive, setIsActive] = useState(false);
  const [isBarActive, setIsBarActive] = useState();
  const [chats, setChats] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [update, setUpdate] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);

  // console.log(chatId);

  //* Additional things
  const navigate = useNavigate();
  const message = useRef(null);

  //* GET MESSAGING -- [GET REQUEST]
  useEffect(() => {
    const getAllMessage = async () => {
      try {
        const data = await MessagingService.GetMessaging();
        console.log("user", data);
        setChats(data?.members);
        setUpdate(false);
      } catch (error) {
        console.error("Error occurred while fetching user profile", error);
      }
    };

    getAllMessage()
    setInterval(() => {
      getAllMessage()
    }, 6000);
  }, [activeChatId, update]);

  //* POST MESSAGE -- [POST REQUEST]
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.current.value) return alert("Message value required");
    try {
      await MessagingService.SendMessage(
        { message: message.current.value },
        activeChatId
      );
      message.current.value = "";
      setUpdate(true);
      getMessageById(localStorage.getItem('chatId'));
    } catch (error) {
      console.log(error);
    }
  };

  //* DELETE CHAT -- [DELETE REQUEST]
  const deleteChat = async (i) => {
    Modal.confirm({
      title: "Iltimos tasdiqlang",
      icon: <ExclamationCircleOutlined />,
      content: "Rostdan ham bu chat-ni o'chirishni xohlaysizmi?",
      okText: "Ha",
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          await MessagingService.DeleteChat(i);
          setUpdate(true);
          location.reload()
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ProfileService.GetProfile();
        console.log(response);
        setUserData(response);
      } catch (error) {
        console.error("Error occurred while fetching user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  //* Handle button active state change
  const handleButtonClick = () => {
    setIsActive(!isActive);
  };

  const handleBarActive = () => {
    setIsBarActive(!isBarActive);
  };

  const [meData, setMeData] = useState();
  const getMessageById = async (chat_id) => {
    const data = await MessagingService.GetMessageById(chat_id);
    setMeData(data.data?.messages);
    return data;
  };
  console.log(meData);
  console.log(userData);

  //
  // console.log('me',resultMeData);
  // console.log('you',resultYouData);

  //* Handle chat bar active
  const handleChatBarActive = (id) => {
    localStorage.setItem('chatId', id)
    getMessageById(id);
    setActiveChatId((prevActiveChatId) => (prevActiveChatId == id ? id : id));
  };

  const selectedChat = chats?.find((chat) => chat.chat_id == activeChatId);
  // console.log(selectedChat);
  return (
    <>
      {/* Header component */}
      {/* Users bar */}
      <div className="users-bar">
        <div className="container">
          <div className="backButton">
            <button onClick={() => navigate(-1)} className="customBack">
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
                <h3 className="layoutButtons__title">
                  {" "}
                  <img
                    src={ChatMessaging}
                    alt="messagin icon"
                    width={30}
                  />{" "}
                  Xabarlar arxivi
                </h3>
              </div>
              {/* Delete messaging */}
              <div className="bg-chat">
                {chats?.length ? (
                  <div>
                    <div className="delete-bar">
                      <button className="trash-icon">
                        <img src={TrashIcon} alt="trash icon" />
                        <span className="trash-span">O'chirish</span>
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
                            handleChatBarActive(info?.chat_id);
                            handleBarActive();
                          }}
                        >
                          <div className="chat-inner">
                            <img
                              src={`http://test.uyjoybaraka.uz/${info?.user?.avatar}`}
                              width={100}
                              alt="user image"
                              className="member-img"
                            />
                          </div>
                          <div className="chat-inner chat-inner__info">
                            <div className="chat-deleting">
                              <span className="chat-user__name">
                                {info?.user?.full_name}
                              </span>
                              <button onClick={() => deleteChat(info?.chat_id)}>
                                <img src={TrashIcon} alt="delete chat icon" />
                              </button>
                            </div>
                            <p className="chat-user__ad">
                              {info.post?.title.substr(0, 57)}
                              {/* {selectedChat.post.title} */}
                            </p>
                            <p className="chat-user__message">
                              {info?.message?.content.substr(0, 45)}....
                              {/* Now, it cuts texts based on user message */}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <img
                      src={NoData}
                      width={280}
                      height={280}
                      alt="no message yet"
                    />
                    <h3>Hali xabarlar yo'q</h3>
                    <p>
                      Asosiy sahifaga o'tish va orzuingizdagi uy-ni topish
                      orqali, suhbatni boshlashingiz mumkin
                    </p>
                    <button onClick={() => navigate("/")}>
                      Asosiy sahifaga
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Chat section */}
            <div
              className={`chatbar-head ${isBarActive ? "d-block" : "d-block"}`}
            >
              {selectedChat && (
                <>
                  <div className="chats-carousel">
                    <div className="chats-carousel-inner">
                      {/* This container will allow horizontal scrolling */}
                      <div className="chats-carousel-container">
                        {chats?.map((info) => (
                          <div
                            key={info.chat_id}
                            className={`chat-circle ${
                              info?.chat_id === activeChatId ? "active" : ""
                            }`}
                            onClick={() => {
                              handleChatBarActive(info?.chat_id);
                              setIsBarActive(true);
                            }}
                          >
                            <img
                              src={`http://test.uyjoybaraka.uz/${info?.user?.avatar}`}
                              width={50}
                              height={50}
                              alt="user image"
                              className="circle-img"
                            />
                            <span className="chat-user__name">
                              {info?.user?.full_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="chatbar-section">
                    <div className="chatbar-layoutButtons">
                      {/* Layout buttons */}
                      <div className="user-selected">
                        <div className="user-inner">
                          <img
                            src={`http://test.uyjoybaraka.uz/${selectedChat?.user?.avatar}`}
                            alt="selected user image"
                            width={100}
                          />
                          <span className="user-name__selected">
                            {selectedChat?.user?.full_name}
                          </span>
                        </div>
                        <div className="trash-inner">
                          <button
                            onClick={() =>
                              deleteChat(selectedChat?.members?.chat_id)
                            }
                          >
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
                              selectedChat?.chat_id === activeChatId
                                ? "chatActive"
                                : ""
                            }`}
                          >
                            <img src={SelectedChatImg} alt="selected chat" />
                            <div>
                              <span className="selected-ad">
                                {showFullTitle
                                  ? selectedChat.post?.title
                                  : selectedChat.post?.title.substr(0, 57) +
                                    "... "}
                                <button
                                  className="more__button"
                                  onClick={() =>
                                    setShowFullTitle(!showFullTitle)
                                  }
                                >
                                  {showFullTitle ? "Kichikroq" : "Batafsil"}
                                </button>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Chats */}
                      <div className="chats-container__bar">
                        <div className="chat-wrapper__bar">
                          <span className="chatbar-date">
                            {selectedChat.message.timestamp
                              .split("T")[0]
                              .split("-")
                              .join(".")}
                          </span>
                        </div>
                      </div>

                      {meData?.length
                        ? 
                        meData?.map((item) => (
                          <><div className={`chat-wrapper__bar ${item.sender_id === userData.data.user?.user_id ? "self-ms" : "client-ms"}`}>
                          <span className="text__msg">
                            {item?.content}
                          </span>
                          <img
                            className="double-check"
                            src={DoubleCheck}
                            alt=""
                          />
                        </div></>
                        ))
                        : ""}

                      {/* Chat messaged mock */}
                      <form>
                        <input
                          type="text"
                          className="chatbar-input"
                          placeholder="Sms yozish"
                          aria-label="Enter your message(Habaringizni kiriting)"
                          ref={message}
                        />
                        <button
                          type="submit"
                          className="chatbar-button"
                          onClick={sendMessage}
                        >
                          <img
                            className="chatbar-send__icon"
                            src={ChatsendIcon}
                            alt="chat-send icon"
                          />
                        </button>
                      </form>
                    </div>
                  </div>
                </>
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
