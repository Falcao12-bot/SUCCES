import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Block, CalloutType } from '../models';
import { colors, radius } from '../theme';
const CO:Record<CalloutType,{label:string;bg:string;bd:string;fg:string}>={
 definition:{label:'Définition',bg:'#ECFDF5',bd:'#86EFAC',fg:'#15803D'},retain:{label:'À retenir',bg:'#FFF7ED',bd:'#FDBA74',fg:'#C2410C'},
 example:{label:'Exemple',bg:'#EFF6FF',bd:'#93C5FD',fg:'#1D4ED8'},method:{label:'Méthode',bg:'#F5F3FF',bd:'#C4B5FD',fg:'#6D28D9'},
 warning:{label:'Attention',bg:'#FEF2F2',bd:'#FCA5A5',fg:'#B91C1C'},note:{label:'Remarque',bg:'#ECFEFF',bd:'#67E8F9',fg:'#0E7490'},tip:{label:'Astuce',bg:'#FEFCE8',bd:'#FDE047',fg:'#A16207'}};
// Rendu unique partagé : édition, aperçu, publication et vue élève => mise en forme identique.
export function BlockRenderer({block:b}:{block:Block}){
 const al={textAlign:b.align??'left'} as const;
 switch(b.kind){
  case 'heading':return <Text style={[s.h,al]}>{b.text}</Text>;
  case 'subheading':return <Text style={[s.sh,al]}>{b.text}</Text>;
  case 'paragraph':return <Text style={[s.p,al]}>{(b.spans??[{text:b.text??''}]).map((sp,i)=>
    <Text key={i} style={{fontWeight:sp.bold?'700':'400',fontStyle:sp.italic?'italic':'normal',textDecorationLine:sp.underline?'underline':'none',color:sp.color,backgroundColor:sp.highlight}}>{sp.text}</Text>)}</Text>;
  case 'callout':{const c=CO[b.callout??'note'];return <View style={[s.co,{backgroundColor:c.bg,borderColor:c.bd}]}><Text style={{color:c.fg,fontWeight:'700',marginBottom:4}}>{c.label}</Text><Text style={s.p}>{b.text}</Text></View>;}
  case 'image':return <View style={{alignItems:b.align==='right'?'flex-end':b.align==='left'?'flex-start':'center'}}><Image source={{uri:b.uri}} style={{width:`${b.widthPct??100}%`,height:160,borderRadius:radius.md}}/>{!!b.caption&&<Text style={s.cap}>{b.caption}</Text>}</View>;
  case 'formula':return <View style={s.f}><Text style={s.ft}>{b.latex}</Text></View>;
  case 'table':return <View style={s.t}>{b.rows?.map((r,i)=><View key={i} style={{flexDirection:'row',backgroundColor:i===0?'#EFF6FF':'#fff'}}>{r.map((c,j)=><Text key={j} style={[s.td,i===0&&{fontWeight:'700'}]}>{c}</Text>)}</View>)}</View>;
  case 'figure':return <View style={{alignItems:'center'}}><Shape shape={b.shape??'circle'}/>{!!b.caption&&<Text style={s.cap}>{b.caption}</Text>}</View>;
 }
}
const s=StyleSheet.create({h:{fontSize:18,fontWeight:'700',color:colors.text},sh:{fontSize:15,fontWeight:'600',color:colors.text},p:{fontSize:14,lineHeight:21,color:colors.text},
 co:{borderWidth:1,borderRadius:radius.md,padding:12},cap:{fontSize:12,color:colors.muted,marginTop:4},f:{backgroundColor:'#F1F5F9',borderRadius:radius.md,padding:14},ft:{fontSize:18,fontStyle:'italic'},
 t:{borderWidth:1,borderColor:colors.border,borderRadius:radius.sm,overflow:'hidden'},td:{flex:1,padding:8,fontSize:13,borderWidth:.5,borderColor:colors.border}});

export function Shape({shape}:{shape:string}){
 const c=colors.primary;
 if(shape==='triangle')return <View style={{width:0,height:0,borderLeftWidth:50,borderRightWidth:50,borderBottomWidth:87,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:c}}/>;
 if(shape==='line')return <View style={{width:140,height:3,backgroundColor:c,marginVertical:40}}/>;
 if(shape==='arrow')return <Text style={{fontSize:64,color:c}}>→</Text>;
 if(shape==='angle')return <View style={{width:80,height:80,borderLeftWidth:3,borderBottomWidth:3,borderColor:c}}/>;
 const w=shape==='rectangle'?140:90;
 return <View style={{width:w,height:90,borderWidth:3,borderColor:c,borderRadius:shape==='circle'?45:0}}/>;
}
