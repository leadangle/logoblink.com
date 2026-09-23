import React from 'react'

const defaultContextValue = {
  data: {
    Sidebar: null,
  },
  set: () => {},
}

const { Provider, Consumer } = React.createContext(defaultContextValue)

class ContextProviderComponent extends React.Component {
  constructor() {
    super()

    this.setData = this.setData.bind(this)
    this.state = {
      ...defaultContextValue,
      set: this.setData,
    }
  }

  setData(newData) {
    this.setState(state => ({
      data: {
        ...state.data,
        ...newData,
      },
    }))
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

class LayoutSlotsParser extends React.Component {
  constructor(props) {
    super(props)

    this.context = props.context
  }
}

const SlotsInside = Component => {
  const WithHOC = props => (
    <Consumer>
      {context => {
        context.populateSlots(props.children)

        return <Component {...props} />
      }}
    </Consumer>
  )

  WithHOC.InnerComponent = Component

  return WithHOC
}

export { Consumer as default, ContextProviderComponent, SlotsInside }
