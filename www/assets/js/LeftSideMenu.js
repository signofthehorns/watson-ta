import React from 'react';
import axios from 'axios';
import ClassMenu from './ClassMenu';

export default class LeftSideMenu extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      menu: [],
    };
  }

  componentWillMount() {
    axios.get('/api/user_menu/')
    .then(res => {
      this.setState({
        menu: res.data.menu,
      })
    });
  }

  render() {
    return <ClassMenu menu={ this.state.menu } key={0} />
  }
};
