import React from 'react';


/**
 *
 */
export default class SidebarList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { title, items } = this.props;

    items = items.map((item, i) => {
        return <li key={i}>
                 <a href={ item.url }>{ item.label }</a>
               </li>
    });

    return (
      <div className='sidebar-list'>
        {
          title
            ? <div className='title'>{ title }</div>
            : null
        }
        <ul>{ items }</ul>
      </div>
    );
  }
}

const ItemPropType = React.PropTypes.shape({
  label: React.PropTypes.string.isRequired,
  url: React.PropTypes.string
});

SidebarList.propTypes = {
  title: React.PropTypes.string,
  items: React.PropTypes.arrayOf(ItemPropType),
};
SidebarList.defaultProps = {
  title: 'Untitled',
  items: []
};
