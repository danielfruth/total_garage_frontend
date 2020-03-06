import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './App.css';
import { Link, Switch, Route } from 'react-router-dom';

function App() {
  const [displayedForm, setDisplayedForm] = useState('');
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem('token') ? true : false
  );
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (loggedIn) {
      fetch('https://total-garage.herokuapp.com/garage/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          setUsername(json.username);
        });
    }
  }, [loggedIn]);

  const handleLogin = (e, data) => {
    e.preventDefault();
    fetch('https://total-garage.herokuapp.com/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        setLoggedIn(true);
        setDisplayedForm('');
        setUsername(json.user.username);
      });
  };

  const handleSignup = (e, data) => {
    e.preventDefault();
    fetch('https://total-garage.herokuapp.com/garage/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        setLoggedIn(true);
        setDisplayedForm('');
        setUsername(json.username);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUsername('');
  };

  const displayForm = form => {
    setDisplayedForm(form);
  };

  return (
    <div className="App">
      <Nav
        loggedIn={loggedIn}
        displayForm={displayForm}
        handleLogout={handleLogout}
        username={username}
      />
      <Switch>
        <Route path="/login">
          <LoginForm handleLogin={handleLogin} />
        </Route>
        <Route path="/signup">
          <SignupForm handleSignup={handleSignup} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
