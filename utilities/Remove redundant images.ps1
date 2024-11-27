$InstagramJSON = Get-Content "./content/data/instagram.json" | ConvertFrom-Json

$InstagramImageFiles = Get-ChildItem "./content/images/instagram" -Filter "*.jpg"

ForEach($Image in $InstagramImageFiles){
  $Result = ($InstagramJSON | ? name -Like $Image.name).Count

  If($Result -eq 0){
    Remove-Item $Image.PSPath -Verbose
    $Counter++
  }

}

Write-Host "Removed $Counter images"