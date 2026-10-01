import React from 'react';
import { Pressable, Text, View, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../theme';
export const Button=({title,onPress,variant='solid',style}:{title:string;onPress:()=>void;variant?:'solid'|'outline'|'white';style?:ViewStyle})=>(
 <Pressable onPress={onPress} style={({pressed})=>[s.btn,variant==='solid'&&{backgroundColor:colors.primary},variant==='white'&&{backgroundColor:'#fff'},variant==='outline'&&{borderWidth:1.5,borderColor:'#fff'},pressed&&{opacity:.8},style]}>
  <Text style={[s.bt,variant==='white'&&{color:colors.primary}]}>{title}</Text></Pressable>);
export const Card=({children,style}:{children:React.ReactNode;style?:ViewStyle})=><View style={[s.card,style]}>{children}</View>;
export const Loading=()=><View style={s.c}><ActivityIndicator color={colors.primary} size="large"/></View>;
export const Empty=({text}:{text:string})=><View style={s.c}><Text style={{color:colors.muted}}>{text}</Text></View>;
const s=StyleSheet.create({btn:{height:48,borderRadius:radius.md,alignItems:'center',justifyContent:'center'},bt:{color:'#fff',fontWeight:'700',fontSize:15},
 card:{backgroundColor:colors.card,borderRadius:radius.lg,padding:14,...shadow},c:{flex:1,alignItems:'center',justifyContent:'center',padding:24}});
