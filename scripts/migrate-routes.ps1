param(
    [string[]]$Files
)

# Migration patterns: replace NextResponse.json(...) with apiOk()/apiCreated()/apiMessage().
# Also adds the import statement when needed.

function Invoke-RouteMigration {
    param([string]$path)

    if (-not (Test-Path -LiteralPath $path)) { return }
    $content = [System.IO.File]::ReadAllText($path)
    $original = $content
    $needsImport = $false

    # Pattern: return NextResponse.json({ message: 'X', entity }, { status: 201 });  →  return apiCreated({ entity }, 'X');
    $content = [regex]::Replace($content,
        "return NextResponse\.json\(\s*\{\s*message:\s*['""]([^'""]+)['""]\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*,\s*\{\s*status:\s*201\s*\}\s*\)",
        { param($m) "return apiCreated({ $($m.Groups[2].Value) }, '$($m.Groups[1].Value)')" }
    )

    # Pattern: return NextResponse.json({ message: 'X', entity });  →  return apiOk({ entity }, 'X');
    $content = [regex]::Replace($content,
        "return NextResponse\.json\(\s*\{\s*message:\s*['""]([^'""]+)['""]\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*\)",
        { param($m) "return apiOk({ $($m.Groups[2].Value) }, '$($m.Groups[1].Value)')" }
    )

    # Pattern: return NextResponse.json({ message: 'X', <key>: <value> });  →  return apiOk({ <key>: <value> }, 'X');
    $content = [regex]::Replace($content,
        "return NextResponse\.json\(\s*\{\s*message:\s*['""]([^'""]+)['""]\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*\)",
        { param($m) "return apiOk({ $($m.Groups[2].Value): $($m.Groups[3].Value) }, '$($m.Groups[1].Value)')" }
    )

    # Pattern: return NextResponse.json({ message: 'X' });  →  return apiMessage('X');
    $content = [regex]::Replace($content,
        "return NextResponse\.json\(\s*\{\s*message:\s*['""]([^'""]+)['""]\s*\}\s*\)",
        { param($m) "return apiMessage('$($m.Groups[1].Value)')" }
    )

    # Pattern: return NextResponse.json({ success: true, data: X });  →  return apiOk(X);
    $content = [regex]::Replace($content,
        "return NextResponse\.json\(\s*\{\s*success:\s*true,\s*data:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*\)",
        { param($m) "return apiOk($($m.Groups[1].Value))" }
    )

    # Pattern: return NextResponse.json(<single var>);  →  return apiOk(<single var>);
    $content = [regex]::Replace($content,
        "return NextResponse\.json\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)",
        { param($m) "return apiOk($($m.Groups[1].Value))" }
    )

    if ($content -ne $original) {
        # Inject apiOk/apiCreated/apiMessage import if used and not present
        $needsApiOk = $content -match '\bapiOk\(' -and $content -notmatch "from '@/lib/server/api-response'"
        $needsApiCreated = $content -match '\bapiCreated\('
        $needsApiMessage = $content -match '\bapiMessage\('

        if ($needsApiOk -or $needsApiCreated -or $needsApiMessage) {
            $imports = @()
            if ($content -match '\bapiOk\(') { $imports += 'apiOk' }
            if ($content -match '\bapiCreated\(') { $imports += 'apiCreated' }
            if ($content -match '\bapiMessage\(') { $imports += 'apiMessage' }
            $importLine = "import { $($imports -join ', ') } from '@/lib/server/api-response';"

            if ($content -notmatch "from '@/lib/server/api-response'") {
                # Insert after the first existing import
                $content = $content -replace "(import [^;]+;)\r?\n", "`$1`n$importLine`n", 1
            }
        }

        # Remove unused NextResponse import if no NextResponse references remain
        if ($content -notmatch '\bNextResponse\b' -or ($content -match '\bNextResponse\b' -and ($content -notmatch 'NextResponse\.json|NextResponse\.redirect|: NextResponse\b'))) {
            # Only remove if NextResponse is truly unused
            if ($content -notmatch 'NextResponse\.\w+' -and $content -notmatch ':\s*NextResponse\b' -and $content -notmatch 'as NextResponse') {
                # Remove standalone NextResponse from imports
                $content = $content -replace ",\s*NextResponse\b", ""
                $content = $content -replace "NextResponse\s*,\s*", ""
                $content = $content -replace "import \{ NextResponse \} from 'next/server';\r?\n", ""
            }
        }

        [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Migrated: $path"
        return $true
    }
    return $false
}

foreach ($f in $Files) {
    Invoke-RouteMigration -path $f
}
