import { useState, useEffect } from 'react';

const App = () => {
  const [ value, setValue ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ previousChats, setPreviousChats ] = useState([]);
  const [ currentTitle, setCurrentTitle ] = useState('');
 
  const createNewChat = () => {
    setMessage('');
    setValue('');
    setCurrentTitle('');
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage('');
    setValue('');
  }

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message);  
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message){
      setPreviousChats(prevChats => (
        [
          ...prevChats,
          {
            title: currentTitle, 
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
            
    }
  }, [message, currentTitle]
  )

  const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)));
  const currentChats = previousChats.filter(prevChat => prevChat.title === currentTitle);

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          { uniqueTitles?.map((title, index) => {
            return (
              <li key={index} onClick={() => handleClick(title)}>
                {title}
              </li>
            )
          })}
        </ul>
        <nav>
          <p>Made By GoldZulu</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>Chat Jeepty</h1>}
        <ul className="feed">
          {currentChats?.map((chatMessage, index) => 
            <li key={index}>
              <p className="role">
                {chatMessage.role}
              </p>
              <p>
                {chatMessage.content}
              </p>
            </li>
          )}    
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="Type a message" />
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            Chat Jeepty may produce inaccurate information about people, places, or facts
          </p>
        </div>

      </section>
      
    </div>
  );
}

export default App;
