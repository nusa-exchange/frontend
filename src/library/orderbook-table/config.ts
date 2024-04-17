export interface Column {
  key: string;
  color: string;
  fontSize: number;
  align: "left" | "center" | "right";
  x: number;
}

export interface Config {
  height?: number;
  width?: number;
  line_height?: number;
  columns?: Column[];
}

export interface Row {
  price: string;
  amount: string;
  total: string;

  change: boolean;
  backgroundColor?: string;
  backgroundWidth?: number;
}