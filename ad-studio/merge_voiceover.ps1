param(
  [Parameter(Mandatory = $true)]
  [string]$VoicePath,
  [ValidateSet("Status1", "Status2", "HD")]
  [string]$Target = "Status1"
)

$root = "c:\Users\Blessing Orodi\Desktop\tuftly2"
$map = @{
  "Status1" = @{ In = "$root\Tuftly_Status_Ad_1_Atelier_Luxe.mp4"; Out = "$root\Tuftly_Status_Ad_1_Atelier_Luxe_FINAL.mp4" }
  "Status2" = @{ In = "$root\Tuftly_Status_Ad_2_Bold_Pop_Drop.mp4"; Out = "$root\Tuftly_Status_Ad_2_Bold_Pop_Drop_FINAL.mp4" }
  "HD"      = @{ In = "$root\Tuftly_Promo_Ad_HD.mp4"; Out = "$root\Tuftly_Promo_Ad_HD_FINAL.mp4" }
}

$t = $map[$Target]
if (-not (Test-Path $t.In)) {
  Write-Error "Target video not found: $($t.In)"
  exit 1
}

Write-Host "Mixing voiceover into $($t.Out)..."
& ffmpeg -y -i $t.In -i $VoicePath `
  -filter_complex "[0:a]volume=0.34[bg];[1:a]adelay=200|200,loudnorm=I=-15:TP=-1.5:LRA=11[vo];[bg][vo]amix=inputs=2:duration=first:dropout_transition=2[aout]" `
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k $t.Out

Write-Host "Done! Saved to $($t.Out)"
