import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-invoice-data',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './invoice-data.component.html',
  styleUrl: './invoice-data.component.css',
})
export class InvoiceDataComponent implements OnInit {
  isUpdateMode: boolean = false;
  currentInvoiceIndex: number | null = null;
  invoiceForm: FormGroup;
  invoiceNumber: string;
  minDateTime: string = '';
  maxDateTime: string = '';
  invoiceNo: string = '';
  invoiceDateTime: string = '';
  customerName: string = '';
  customerMobile: string = '';
  currentDateAndTime = '';
  categories = [
    {
      name: 'Elecronics',
      items: [
        { name: 'Iphone 16 pro Max', price: 129000 },
        { name: 'One plus node2', price: 30000 },
        { name: 'MackBook', price: 65000 },
      ],
    },
    {
      name: 'Vegetables',
      items: [
        { name: 'Carrot', price: 40 },
        { name: 'Tomato', price: 30 },
      ],
    },
  ];

  selectedCategory: any = null;
  items: any[] = [];
  selectedItem: any = null;
  quantity: number = 1;
  discount: number = 0;
  tableData: any[] = [];
  totalQuantity: number = 0;
  totalAmount: number = 0;
  ActualAmount: number = 0;
  totalvalue: number = 0;
  totalDiscount: number = 0;
  totalUnitPrice: number = 0;
  selectedPaymentMethod: string = 'Cash';
  discountPercentage: number = 0;
  invoices: any[] = [];

  constructor(private fb: FormBuilder) {
    this.invoiceNumber = Math.random().toString(36).substr(2, 8).toUpperCase();
    this.invoiceForm = this.fb.group({
      invoiceDateTime: ['', Validators.required],
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerMobile: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      selectedPaymentMethod: ['Cash', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInvoice();
    const currentDate = new Date();
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59
    );
    this.maxDateTime = endOfDay.toISOString().slice(0, 16);
  }

  deleteInvoice(invoice: any) {
    // Remove invoice from array
    this.invoices = this.invoices.filter(
      (inv) => inv.invoiceNumber !== invoice.invoiceNumber
    );
    localStorage.setItem('invoices', JSON.stringify(this.invoices));
    alert('Invoice deleted successfully!');
  }
  printInvoice(invoice: any) {
    const printWindow = window.open('', '', 'width=800,height=600');

    if (!printWindow) return alert('Popup blocked. Please allow popups.');

    const sortedItems = invoice.items.sort((a: any, b: any) =>
      a.itemName.localeCompare(b.itemName)
    );

    const invoiceItems = sortedItems
      .map(
        (item: any) => `
    <tr>
      <td>${item.itemName}</td>
      <td>${item.quantity}</td>
      <td>${item.unitPrice}</td>
      <td>${item.discount}</td>
      <td>${item.netAmount}</td>
    </tr>
  `
      )
      .join('');

    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice ID: ${invoice.invoiceNumber}</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <table>
          <tbody>
            <tr>
              <td><strong>Invoice Number:</strong></td>
              <td>${invoice.invoiceNumber}</td>
              <td><strong>Customer Name:</strong></td>
              <td>${invoice.customerName}</td>
            </tr>
            <tr>
              <td><strong>Customer Mobile:</strong></td>
              <td>${invoice.customerMobile}</td>
              <td><strong>Payment Method:</strong></td>
              <td>${invoice.selectedPaymentMethod}</td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceItems}
          </tbody>
        </table>
        <h1><strong>Paid Amount:</strong> ${invoice.totalAmount}</h1>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  }

  onCategoryChange() {
    this.items = this.selectedCategory ? this.selectedCategory.items : [];
    this.selectedItem = null;
  }

  addItem() {
    if (this.selectedItem && this.quantity > 0) {
      const discount =
        (this.selectedItem.price * this.quantity * this.discountPercentage) /
        100;
      const netAmount = this.selectedItem.price * this.quantity - discount;
      // const netAmount = this.selectedItem.price * this.quantity - discount;

      const rowData = {
        itemName: this.selectedItem.name,
        quantity: this.quantity,
        unitPrice: this.selectedItem.price,
        discount: discount.toFixed(2),
        netAmount: netAmount.toFixed(2),
      };

      this.tableData.push(rowData);
      this.calculateTotals();
    }
    // this.resetInvoice();

    this.removeCat();
  }

  deleteItem(index: number) {
    this.tableData.splice(index, 1);
    this.calculateTotals();
  }

  removeCat() {
    this.selectedCategory = null;
    this.items = [];
    this.selectedItem = null;
    this.quantity = 1;
    this.discountPercentage = 0;
  }

  calculateTotals() {
    this.totalQuantity = this.tableData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.totalUnitPrice = this.tableData.reduce(
      (sum, item) => sum + item.unitPrice,
      0
    );
    this.totalDiscount = this.tableData.reduce(
      (sum, item) => sum + parseFloat(item.discount),
      0
    );
    this.totalAmount = this.tableData.reduce(
      (sum, item) => sum + parseFloat(item.netAmount),
      0
    );
    this.totalvalue = this.tableData.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }

  saveData() {
    const invoiceData = {
      invoiceNumber: this.invoiceNumber,
      invoiceDateTime: this.invoiceDateTime,
      customerName: this.customerName,
      customerMobile: this.customerMobile,
      ActualAmount: this.totalvalue,
      totalQuantity: this.totalQuantity,
      items: this.tableData.map((item) => ({
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        netAmount: item.netAmount,
      })),
      selectedPaymentMethod: this.selectedPaymentMethod,
      totalAmount: this.totalAmount,
    };

    let existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');

    if (this.isUpdateMode && this.currentInvoiceIndex !== null) {
      existingInvoices[this.currentInvoiceIndex] = invoiceData;
      alert('Invoice updated successfully!');
    } else {
      existingInvoices.push(invoiceData);
      alert('Invoice data has been saved!');
    }

    localStorage.setItem('invoices', JSON.stringify(existingInvoices));
    this.invoices = existingInvoices;

    this.resetInvoice();
    this.isUpdateMode = false;
    this.currentInvoiceIndex = null;
  }

  updateInvoice(invoice: any, index: number) {
    this.invoiceNumber = invoice.invoiceNumber;
    this.invoiceDateTime = invoice.invoiceDateTime;
    this.customerName = invoice.customerName;
    this.customerMobile = invoice.customerMobile;
    this.selectedPaymentMethod = invoice.selectedPaymentMethod;
    this.tableData = invoice.items;
    this.isUpdateMode = true;
    this.currentInvoiceIndex = index;
  }

  loadInvoice() {
    this.invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    // console.log('Loaded Invoices:', this.invoices);
  }

  cancelData() {
    this.tableData = [];
    this.calculateTotals();
    localStorage.removeItem('invoiceData');
    alert('All data has been cleared!');
  }

  resetInvoice() {
    this.invoiceNumber = Math.random().toString(36).substr(2, 8).toUpperCase();
    this.invoiceDateTime = '';
    this.customerName = '';
    this.customerMobile = '';
    this.selectedCategory = null;
    this.items = [];
    this.selectedItem = null;
    this.quantity = 1;
    this.discount = 0;
    this.tableData = [];
    this.totalQuantity = 0;
    this.totalUnitPrice = 0;
    this.totalAmount = 0;
    this.totalDiscount = 0;
    this.selectedPaymentMethod = 'Cash';
  }
}
