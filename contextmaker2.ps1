function Show-IndentedTree {
    [CmdletBinding()]
    param(
        [Parameter(Position=0, ValueFromPipeline=$true, ValueFromPipelineByPropertyName=$true)]
        [string]$Path = (Get-Location).Path,

        [Parameter()]
        [int]$Depth = 0,

        [Parameter()]
        [string[]]$Exclude = @(".git", "_site", "node_modules", ".aider*", ".vscode"), # Common things to exclude

        [Parameter()]
        [string]$IndentChar = "    " # 4 spaces for indentation
    )

    # Generate the indentation string for the current level
    $indent = $IndentChar * $Depth

    # Get items, excluding specified ones *at this level*
    # Note: -Exclude filters on the Name property, not the full path part being recursed into
    Get-ChildItem -Path $Path -Depth 0 -Exclude $Exclude | Sort-Object -Property @{Expression={$_.PSIsContainer}; Descending=$true}, Name | ForEach-Object {
        # Print the current item's name with indentation
        $itemName = $_.Name
        if ($_.PSIsContainer) {
            $itemName += "/" # Add a slash to directories
        }
        Write-Host "$($indent)$itemName"

        # If it's a directory, recurse
        if ($_.PSIsContainer) {
            # Pass exclude list down, but the primary filtering happens in Get-ChildItem above
            Show-IndentedTree -Path $_.FullName -Depth ($Depth + 1) -Exclude $Exclude -IndentChar $IndentChar
        }
    }
}