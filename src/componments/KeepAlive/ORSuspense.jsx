import React from "react";
class ORSuspense extends React.PureComponent {
  state = {
    promise: null,
  };

  static getDerivedStateFromError(e) {
    console.log(e);
  }

  componentDidCatch(e) {
    if (e instanceof Promise) {
      this.setState(
        {
          promise: e,
        },
        () => {
          e.then(() => {
            this.setState({
              promise: null,
            });
          });
        }
      );
    }
  }

  render() {
    const { fallback, children } = this.props;

    const { promise } = this.state;

    return <>{promise ? fallback : children}</>;
  }
}

export default ORSuspense;
