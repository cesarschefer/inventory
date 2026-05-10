@extends('reports.layout')

@section('content')
    <table>
        <thead>
            <tr>
                <th>Concept</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Sales</td>
                <td>{{ number_format($data['salesTotal'], 2) }}</td>
            </tr>
            <tr>
                <td>Purchases</td>
                <td>{{ number_format($data['purchasesTotal'], 2) }}</td>
            </tr>
            <tr>
                <td><strong>Profit</strong></td>
                <td><strong>{{ number_format($data['profit'], 2) }}</strong></td>
            </tr>
        </tbody>
    </table>
@endsection