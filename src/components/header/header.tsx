import { Component, ComponentChildren } from 'preact';

function noop() { }

function toNode(el: typeof document.body | ParentNode | null): typeof document | null | ParentNode {
  return el === document.body ? document : el;
}

type Handler = (el: HTMLElement) => void;
interface IProps {
  buffer?: number,
  disabled?: boolean,
  listenTo?: typeof document.body,
  id?: string,
  className?: string,
  fixClass?: string,
  readyClass?: string,
  showClass?: string,
  children?: ComponentChildren,
  onShow?: Handler,
  onHide?: Handler,
}
interface IState {
  isFixed: boolean,
  isReady: boolean,
  isShown: boolean
}
let lastScroll: number = 0
let firstReverse: number = 0

export default class ScrollHeader extends Component<IProps, IState> {
  height: number = 0;
  buffer: number = 0;
  parent: typeof document.body | ParentNode | null = null;
  onScroll: (ev: Event) => void;

  constructor(props: IProps) {
    super(props);

    this.buffer = props.buffer || 0;
    this.parent = props.listenTo || null;

    this.state = {
      isFixed: false,
      isReady: false,
      isShown: false
    };

    let Y = 0;

    this.onScroll = (e: Event) => {
      // const Y = (e.target.scrollingElement || e.target).scrollTop;
      if (e.target && "scrollingElement" in e.target) {
        Y = (e.target.scrollingElement as HTMLBodyElement).scrollTop
      } else {
        Y = (e.target as HTMLBodyElement).scrollTop
      }

      if (!lastScroll) {
        lastScroll = Y;
      }

      if (Y >= this.height) {
        this.setState({ isFixed: true });
        if (lastScroll <= Y) {
          // reset, is scrolling down
          firstReverse = 0;
          this.setState({ isShown: false });
        } else {
          if ((firstReverse - Y) > this.buffer) {
            this.setState({ isShown: true });
          }
          firstReverse = firstReverse || Y;
        }
        lastScroll = Y;
      } else {
        firstReverse = 0;
        this.setState({ isFixed: false, isShown: false });
      }
    }

  }
  componentDidMount() {
    const bs = this.base as HTMLElement
    this.height = bs.offsetHeight;
    this.parent = this.parent || bs.parentNode;
    console.log(this.parent)
    this.props.disabled || toNode(this.parent)?.addEventListener('scroll', this.onScroll, { passive: true });
  }

  componentWillReceiveProps(props: IProps) {
    const el = this.parent;
    const prev = this.props.disabled;
    // is newly enabled
    (prev && !props.disabled) && toNode(el)?.addEventListener('scroll', this.onScroll, { passive: true });
    // is newly disabled
    (!prev && props.disabled) && toNode(el)?.removeEventListener('scroll', this.onScroll);
  }

  shouldComponentUpdate(props: IProps, state: IState) {
    const now = this.state;
    return props !== this.props
      || state.isFixed !== now.isFixed
      || state.isReady !== now.isReady
      || state.isShown !== now.isShown;
  }

  componentDidUpdate(props: IProps, state: IState) {
    const fix = this.state.isFixed;
    const now = this.state.isShown;
    // delay `isReady` application; transition flashing
    (state.isFixed !== fix) && setTimeout(() => this.setState({ isReady: fix }), 1);
    // call user callbacks if `shown` state changed
    if (state.isShown !== now) {
      ((now ? props.onShow : props.onHide) || noop).call(this, this.base as HTMLElement);
    }
  }

  render(props: IProps, state: IState) {
    let cls = props.className || '';

    if (!props.disabled) {
      state.isFixed && (cls += ` ${props.fixClass || 'is--fixed'}`);
      state.isReady && (cls += ` ${props.readyClass || 'is--ready'}`);
      state.isShown && (cls += ` ${props.showClass || 'is--shown'}`);
    }

    return (
      <header id={props.id} className={cls}>
        <div>{props.children}</div>
      </header>
    );
  }
}
