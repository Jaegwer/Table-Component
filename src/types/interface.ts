export interface OptionItem {
	text: string;
	value: string;
  }
  export interface CostCentre {
	name: string;
	provider: string | boolean | undefined;
	consumer: string | boolean | undefined;
	Onaccount: string | null;
  }
  export interface Headers{
	 title: string | undefined
	 align: 'start' | 'end' | 'center' | undefined
	 key:
    | 'data-table-group'
    | 'data-table-select'
    | 'data-table-expand'
    | (string & {})
    | undefined
  }
  export interface Row{
	name:string;
	provider:string | boolean;
	consumer:string | boolean;
	Onaccount:string;
  }
  export interface Filter {
    name: string;
    provider: string | boolean;
    consumer: string | boolean;
    Onaccount: string;
}
  export interface SelectedData{
	name:string;
	provider:string | boolean;
	consumer:string | boolean;
	Onaccount:string;
  }
  export interface Props {
	search: string;
	isProvider: boolean;
	isConsumer: boolean;
	resetFilters: () => void;
	emitSearch: (search: string) => void;
	emitProvider: (isProvider: boolean) => void;
	emitConsumer: (isConsumer: boolean) => void;
  }