export function disablePlayerCaptions(player: YT.Player): void {
  const captionCapablePlayer = player as YT.Player & { unloadModule?: (moduleName: string) => void };
  captionCapablePlayer.unloadModule?.('captions');
}
