<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{ $title ?? 'Report' }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
        }

        h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
        }

        .meta {
            margin-bottom: 20px;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th {
            background: #2c3e50;
            color: white;
            padding: 8px;
            text-align: left;
        }

        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        tfoot td {
            font-weight: bold;
            border-top: 2px solid #2c3e50;
        }
    </style>
</head>

<body>
    <h1>{{ $title }}</h1>
    <div class="meta">
        <strong>From:</strong> {{ $from->format('d/m/Y') }} &nbsp;
        <strong>To:</strong> {{ $to->format('d/m/Y') }}
    </div>

    @yield('content')
</body>

</html>