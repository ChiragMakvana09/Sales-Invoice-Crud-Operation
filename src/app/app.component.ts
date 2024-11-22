import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvoiceDataComponent } from './invoice-data/invoice-data.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,InvoiceDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoiceData';
}
