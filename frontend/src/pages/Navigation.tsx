import { Nav, type INavLinkGroup, type INavStyles } from '@fluentui/react'
import React from 'react'


const navStyles: Partial<INavStyles> = {
  root: {
    width: 208,
    height: "100vh",
    boxSizing: 'border-box',
    border: '1px solid #eee',
    overflowY: 'auto',
  },

};

const key="key4";


const navLinkGroups: INavLinkGroup[] = [
  {
    
    links: [
      {
        name: 'Home',
        url: 'http://example.com',
        expandAriaLabel: 'Expand Home section',
        links: [
          {
            name: 'Activity',
            url: 'http://msn.com',
            key: 'abcd',
            target: '_blank',
          },
          {
            name: 'MSN',
            url: 'http://msn.com',
            disabled: true,
            key: 'key2',
            target: '_blank',
          },
        ],
        isExpanded: true,
      },
      {
        name: 'Documents',
        url: 'http://example.com',
        key: 'key3',
        isExpanded: true,
        target: '_blank',
      },
      {
        name: 'Pages',
        url: 'http://msn.com',
        key: 'key4',
        target: '_blank',
      },
      {
        name: 'Notebook',
        url: 'http://msn.com',
        key: 'key5',
        disabled: true,
      },
      {
        name: 'Communication and Media',
        url: 'http://msn.com',
        key: 'key6',
        target: '_blank',
      },
      {
        name: 'News',
        url: 'http://cnn.com',
        icon: 'News',
        key: 'key7',
        target: '_blank',
      },
    ],
  },
];

const Navigation = () => {
  return (
  <Nav
      selectedKey={key}
      ariaLabel="Nav basic example"
      styles={navStyles}
      groups={navLinkGroups}
    />
  )
}

export default Navigation