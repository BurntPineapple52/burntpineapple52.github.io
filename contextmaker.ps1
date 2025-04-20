# Define the output file name
$outputFile = 'context_structure.md'

# Start building the content array
$output = @()

# --- System Information ---
$output += '# System Information'
$output += ''
# These MUST use double quotes for subexpression evaluation: $($...)
$output += "- OS: $((Get-CimInstance Win32_OperatingSystem).Caption)"
$output += "- PowerShell Version: $($PSVersionTable.PSVersion.ToString())"
$output += ''

# --- Recursive Directory Structure ---
# This MUST use double quotes for subexpression evaluation: $($PWD.Path)
$output += "# Recursive Directory Structure: $($PWD.Path)"
$output += ''
$output += '```'
# Execute the native 'tree' command and capture its output.
# /F includes filenames. /A uses ASCII characters for tree lines (more compatible).
# The output of external commands is often an array of strings (lines).
try {
    # Execute tree command and capture output lines
    $treeOutput = tree /F /A | Out-String # Use Out-String to ensure it's treated as text
    
    # Add the captured tree output to our main output array
    # Split the string output back into lines for the array, removing potential empty last line
    $output += $treeOutput.Split([Environment]::NewLine) | Where-Object { $_ } 

} catch {
    $output += "Error executing 'tree /F /A': $($_.Exception.Message)"
    $output += "Please ensure 'tree.com' is available in your system's PATH."
    Write-Warning "Failed to generate directory tree. Error: $($_.Exception.Message)"
}

$output += '```'
$output += ''

# Write the collected output array to the markdown file using UTF8 encoding
# Ensure the directory for the output file exists (optional, good practice)
$outputDir = Split-Path -Path $outputFile -Parent
if ($outputDir -and !(Test-Path -Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

Set-Content -Path $outputFile -Value $output -Encoding UTF8

# Confirmation message
# This MUST use double quotes for variable expansion: '$outputFile' -> 'context_structure.md'
# Note: The single quotes *inside* the double quotes are treated literally, which is desired here.
Write-Host "Generated '$outputFile' with system info and full recursive directory structure."