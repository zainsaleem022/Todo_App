import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const todoContext = createContext();

const TodoContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <todoContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </todoContext.Provider>
  );
};

export const TodoAppState = () => {
  return useContext(todoContext);
};

export default TodoContextProvider;
