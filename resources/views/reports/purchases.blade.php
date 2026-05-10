@extends('reports.layout')

@section('content')
    <table>
        <thead>
            <tr>
                <th>#ID</th>
                <th>Date</th>
                <th>Invoice No.</th>
                <th>Supplier</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @php $grandTotal = 0; @endphp

            @foreach($invoices as $invoice)
                <tr>
                    <td>{{ $invoice->id }}</td>
                    <td>{{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') }}</td>
                    <td>{{ $invoice->invoice_number }}</td>
                    <td>{{ $invoice->supplier->name }}</td>
                    <td>{{ number_format($invoice->total, 2) }}</td>
                </tr>
                @php $grandTotal += $invoice->total; @endphp
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4">Total</td>
                <td>{{ number_format($grandTotal, 2) }}</td>
            </tr>
        </tfoot>
    </table>
@endsection