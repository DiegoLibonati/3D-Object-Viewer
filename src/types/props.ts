interface DefaultProps {
  className?: string | undefined;
  children?: string | undefined;
}

export interface ControlProps extends DefaultProps {
  srcImg: string;
  label: string;
}
