// Stockage en mémoire (à remplacer par AsyncStorage / API).
import { useState, useEffect } from 'react';
const favs=new Set<string>();const subs=new Set<()=>void>();
export const toggleFav=(id:string)=>{favs.has(id)?favs.delete(id):favs.add(id);subs.forEach(f=>f());};
export const isFav=(id:string)=>favs.has(id);
export function useFavs(){const [,n]=useState(0);useEffect(()=>{const f=()=>n(x=>x+1);subs.add(f);return()=>{subs.delete(f);};},[]);return [...favs];}
