export interface Component {
  cleanup?: () => void;
}

export interface ControlComponent extends Component, HTMLDivElement {}
