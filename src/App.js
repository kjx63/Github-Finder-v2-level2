import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import axios from 'axios';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

const github = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 1000,
  headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN },
});

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  };

  // Search Github Users
  searchUsers = async (text) => {
    this.setState({
      loading: true,
    });
    const res = await github.get(`/search/users?q=${text}`);
    this.setState({
      users: res.data.items,
      loading: false,
    });
  };

  // Get a User
  getUser = async (username) => {
    this.setState({
      loading: true,
    });
    const res = await github.get(`/users/${username}`);
    this.setState({
      user: res.data,
      loading: false,
    });
  };

  // Get users repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });
    const res = await github.get(
      `/users/${username}/repos?per_page=5&sort=created:asc`
    );
    this.setState({ repos: res.data, loading: false });
  };

  // Cleaer users from state
  clearUsers = () => {
    this.setState({
      users: [],
      loading: false,
    });
  };

  // Set Alert
  setAlert = (msg, type) => {
    this.setState({
      alert: { msg, type },
    });

    setTimeout(() => this.setState({ alert: null }), 3000);
  };

  render() {
    const { users, user, repos, loading } = this.state;
    return (
      <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path='/about' component={About}></Route>
              <Route
                exact
                path='/user/:login'
                render={(props) => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
                    user={user}
                    repos={repos}
                    loading={loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
