import React,{useLayoutEffect,useState} from 'react';
import { View, Text, ScrollView, Pressable, Switch, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useFavs, toggleFav } from '../services/store';
import { Card, Loading, Empty, Button } from '../components/ui';
import { Exercise } from '../models';
import { colors } from '../theme';

export function ExamList({navigation}:any){const [d,setD]=useState<any[]>();React.useEffect(()=>{api.exams().then(setD);},[]);if(!d)return <Loading/>;
 return <FlatList data={d} keyExtractor={x=>x.id} contentContainerStyle={{padding:16,gap:10}} ListEmptyComponent={<Empty text="Aucun examen disponible"/>}
  renderItem={({item})=><Pressable onPress={()=>navigation.navigate('Exam',{title:item.title})}><Card><Text style={{fontWeight:'700'}}>{item.title}</Text><Text style={{color:colors.muted,fontSize:12}}>{item.questions} questions</Text></Card></Pressable>}/>;}

export function Exam({route,navigation}:any){const [q,setQ]=useState<Exercise[]>();const [a,setA]=useState<Record<string,string>>({});
 React.useEffect(()=>{api.exercises().then(setQ);},[]);if(!q)return <Loading/>;
 const finish=()=>{const score=q.filter(e=>a[e.id]?.trim()===e.answer).length;navigation.replace('ExamResult',{score,total:q.length,title:route.params.title});};
 return <ScrollView contentContainerStyle={{padding:16,gap:12}} keyboardShouldPersistTaps="handled">{q.map((e,i)=><Card key={e.id} style={{gap:8}}><Text style={{fontWeight:'700'}}>{i+1}. {e.prompt}</Text>
  {(e.choices??[]).map(c=><Pressable key={c} onPress={()=>setA({...a,[e.id]:c})} style={{padding:10,borderRadius:8,backgroundColor:a[e.id]===c?'#DBEAFE':'#F8FAFC'}}><Text>{c}</Text></Pressable>)}</Card>)}
  <Button title="Terminer l'examen" onPress={finish}/></ScrollView>;}

export function ExamResult({route,navigation}:any){const {score,total,title}=route.params;const pct=Math.round(score/total*100);
 return <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center',padding:24,gap:12}}><Text style={{color:colors.muted}}>{title}</Text>
  <Text style={{fontSize:56,fontWeight:'800',color:pct>=50?colors.green:colors.red}}>{pct}%</Text><Text>{score} bonne(s) réponse(s) sur {total}</Text>
  <Button title="Retour aux examens" onPress={()=>navigation.popToTop?.()||navigation.goBack()} style={{alignSelf:'stretch'}}/></SafeAreaView>;}

const PROG=[['Mathématiques',75,'#3B82F6'],['Français',60,'#EC4899'],['SVT',45,'#84CC16'],['Histoire-Géo',50,'#F97316']] as const;
export function Progress(){return <ScrollView contentContainerStyle={{padding:16,gap:12}}>
 <View style={{flexDirection:'row',gap:10}}>{[['12','Cours terminés'],['8','Exos terminés'],['70%','Progression']].map(([v,l])=><Card key={l} style={{flex:1,alignItems:'center'}}><Text style={{fontSize:22,fontWeight:'800',color:colors.primary}}>{v}</Text><Text style={{fontSize:11,color:colors.muted,textAlign:'center'}}>{l}</Text></Card>)}</View>
 <Text style={{fontWeight:'700'}}>Progression par matière</Text>
 <Card style={{gap:14}}>{PROG.map(([n,p,c])=><View key={n}><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontSize:13}}>{n}</Text><Text style={{fontSize:12,color:colors.muted}}>{p}%</Text></View>
  <View style={{height:6,borderRadius:3,backgroundColor:'#E2E8F0',marginTop:4}}><View style={{width:`${p}%`,height:6,borderRadius:3,backgroundColor:c}}/></View></View>)}</Card></ScrollView>;}

export function Favorites({navigation}:any){const f=useFavs();
 if(!f.length)return <Empty text="Aucun favori. Touche l'étoile dans une leçon pour l'ajouter."/>;
 return <FlatList data={f} keyExtractor={x=>x} contentContainerStyle={{padding:16,gap:10}} renderItem={({item})=><Pressable onPress={()=>navigation.navigate('Lesson',{id:item})}><Card><Text style={{fontWeight:'700'}}>Leçon {item}</Text></Card></Pressable>}/>;}

export function FavButton({id,navigation}:{id:string;navigation:any}){const f=useFavs();const on=f.includes(id);
 useLayoutEffect(()=>{navigation.setOptions({headerRight:()=><Pressable onPress={()=>toggleFav(id)} hitSlop={10}><Ionicons name={on?'star':'star-outline'} size={22} color={colors.primary}/></Pressable>});},[on]);return null;}

export function Settings({navigation}:any){const [n,setN]=useState(true);const [dk,setDk]=useState(false);
 return <View style={{padding:16,gap:10}}>{([['Notifications',n,setN],['Mode sombre',dk,setDk]] as const).map(([l,v,s])=><Card key={l} style={{flexDirection:'row',alignItems:'center'}}><Text style={{flex:1}}>{l}</Text><Switch value={v} onValueChange={s}/></Card>)}
  <Button title="Se déconnecter" onPress={()=>navigation.reset({index:0,routes:[{name:'Welcome'}]})}/></View>;}
