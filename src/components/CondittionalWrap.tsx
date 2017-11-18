interface IProps {
  condition: boolean;
  wrap(wrapper: (children: any) => any): any;
  children: any;
}

export const ConditionalWrap = ({ condition, wrap, children }: IProps) =>
  condition ? wrap(children) : children;
