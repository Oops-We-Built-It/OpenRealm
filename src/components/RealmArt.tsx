/** Code-native scenery; no third-party image assets or remote requests. */
export function RealmArt({ forge = false, hero = false }: { forge?: boolean; hero?: boolean }) {
  return <div className={`realm-art ${forge ? 'forge-art' : 'forest-art'} ${hero ? 'hero-art' : ''}`} aria-hidden="true"><div className="moon"/><div className="mountain mountain-back"/><div className="mountain mountain-front"/><div className="mist"/>{forge ? <div className="forge-temple"><i/><i/><i/><div className="forge-door"/></div> : <><div className="tree tree-one"/><div className="tree tree-two"/><div className="tree tree-three"/><div className="portal"><div/></div></>}<div className="ground"/><span className="spark s1"/><span className="spark s2"/><span className="spark s3"/></div>;
}
