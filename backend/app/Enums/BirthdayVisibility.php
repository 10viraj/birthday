<?php

namespace App\Enums;

enum BirthdayVisibility: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';
    case PASSWORD_PROTECTED = 'password_protected';
}
