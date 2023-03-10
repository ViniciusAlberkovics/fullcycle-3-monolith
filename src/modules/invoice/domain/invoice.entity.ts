import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "./product.entity";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: Product[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: Product[];

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
    this.validate();
  }

  get name(): string {
    return this._name;
  }
  get document(): string {
    return this._document;
  }
  get address(): Address {
    return this._address;
  }
  get items(): Product[] {
    return this._items;
  }

  private validate(): void {
    if (this.items.length < 1) {
      throw new Error('Items are required');
    }
  }

  total(): number {
    return this.items.reduce((acc, currentItem) => {
      acc += currentItem.price;
      return acc;
    }, 0);
  }
}
