<?php

namespace App\Enums;

enum InvoiceStatus: int
{
    case CREATED = 0;
    case CONFIRMED = 1;
    case CANCELLED = 2;
}
