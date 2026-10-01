import React,{useCallback,useState} from 'react';
import { View, Text, FlatList, Pressable, Alert, ScrollView, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { Card, Loading, Empty, Button } from '../components/ui';
import { colors } from '../theme';

function useList<T>(f:()=>Promise<T[]>){const [d,setD]=useState<T[]>();const load=useCallback(()=>{f().then(setD);},[]);useFocusEffect(load);return {d,setD,load};}
function Row({title,sub,badge,onPress,onDelete}:{title:string;sub:string;badge?:string;onPress?:()=>void;onDelete?:()=>void}){
 return <Pressable onPress={onPress}><Card style={{flexDirection:'row',alignItems:'center',gap:10}}>
  <View style={{flex:1}}><Text style={{fontWeight:'700'}}>{title}</Text><Text style={{color:colors.muted,fontSize:12}}>{sub}</Text></View>
  {!!badge&&<Text style={{fontSize:11,color:colors.primary,backgroundColor:'#EFF6FF',paddingHorizontal:8,paddingVertical:3,borderRadius:8}}>{badge}</Text>}
  {onDelete&&<Pressable onPress={onDelete} hitSlop={10}><Ionicons name="trash-outline" size={20} color={colors.red}/></Pressable>}</Card></Pressable>;}

export function Dashboard({navigation}:any){
 const items:[string,string,string][]=[['Cours','book','AdminCourses'],['Exercices','create','AdminExercises'],['Examens','document-text','AdminExams'],['Utilisateurs','people','AdminUsers']];
 return <ScrollView contentContainerStyle={{padding:16,gap:12}}>
  <View style={{flexDirection:'row',gap:10}}>{[['Cours','24'],['Élèves','1 250'],['Exercices','180']].map(([l,v])=><Card key={l} style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20,fontWeight:'800',color:colors.primary}}>{v}</Text><Text style={{fontSize:12,color:colors.muted}}>{l}</Text></Card>)}</View>
  {items.map(([l,i,r])=><Pressable key={l} onPress={()=>navigation.navigate(r)}><Card style={{flexDirection:'row',alignItems:'center',gap:12}}><Ionicons name={i as any} size={24} color={colors.primary}/><Text style={{flex:1,fontWeight:'700'}}>{l}</Text><Ionicons name="chevron-forward" size={18} color={colors.muted}/></Card></Pressable>)}
  <Button title="Se déconnecter" variant="solid" onPress={()=>navigation.replace('Welcome')}/></ScrollView>;}

export function ManageCourses({navigation}:any){
 const {d,load}=useList(api.allLessons);
 const del=(id:string)=>Alert.alert('Supprimer ce cours ?','Cette action est définitive.',[{text:'Annuler'},{text:'Supprimer',style:'destructive',onPress:async()=>{await api.deleteLesson(id);load();}}]);
 if(!d)return <Loading/>;
 return <View style={{flex:1}}><FlatList data={d} keyExtractor={l=>l.id} contentContainerStyle={{padding:16,gap:10}} ListEmptyComponent={<Empty text="Aucun cours. Crée le premier !"/>}
  renderItem={({item})=><Row title={item.title} sub={`${item.blocks.length} blocs`} badge={item.status==='published'?'Publié':'Brouillon'} onPress={()=>navigation.navigate('Editor',{id:item.id})} onDelete={()=>del(item.id)}/>}/>
  <View style={{padding:16}}><Button title="+ Créer un cours" onPress={()=>navigation.navigate('Editor')}/></View></View>;}

export function ManageExercises({navigation}:any){const {d}=useList(api.exercisesAdmin);if(!d)return <Loading/>;
 return <View style={{flex:1}}><FlatList data={d} keyExtractor={e=>e.id} contentContainerStyle={{padding:16,gap:10}} ListEmptyComponent={<Empty text="Aucun exercice"/>} renderItem={({item})=><Row title={item.prompt} sub={item.type==='qcm'?'QCM':'Réponse libre'}/>}/>
  <View style={{padding:16}}><Button title="+ Nouvel exercice" onPress={()=>navigation.navigate('NewExercise')}/></View></View>;}
export function ManageExams({navigation}:any){const {d}=useList(api.exams);if(!d)return <Loading/>;
 return <View style={{flex:1}}><FlatList data={d} keyExtractor={e=>e.id} contentContainerStyle={{padding:16,gap:10}} ListEmptyComponent={<Empty text="Aucun examen"/>} renderItem={({item})=><Row title={item.title} sub={`${item.questions} questions`}/>}/>
  <View style={{padding:16}}><Button title="+ Nouvel examen" onPress={()=>navigation.navigate('NewExam')}/></View></View>;}
const inp={borderWidth:1,borderColor:colors.border,borderRadius:10,padding:10,marginBottom:12} as const;
export function NewExercise({navigation}:any){const [q,setQ]=useState('');const [ch,setCh]=useState('');const [a,setA]=useState('');
 const save=async()=>{if(!q.trim()||!a.trim())return Alert.alert('Champs requis','Énoncé et bonne réponse.');const choices=ch.split(',').map(x=>x.trim()).filter(Boolean);
  await api.addExercise({id:String(Date.now()),prompt:q,type:choices.length?'qcm':'text',choices:choices.length?choices:undefined,answer:a.trim()});navigation.goBack();};
 return <ScrollView contentContainerStyle={{padding:16}} keyboardShouldPersistTaps="handled"><Text>Énoncé</Text><TextInput style={inp} value={q} onChangeText={setQ} multiline/>
  <Text>Choix (séparés par des virgules, vide = réponse libre)</Text><TextInput style={inp} value={ch} onChangeText={setCh}/><Text>Bonne réponse</Text><TextInput style={inp} value={a} onChangeText={setA}/><Button title="Enregistrer" onPress={save}/></ScrollView>;}
export function NewExam({navigation}:any){const [t,setT]=useState('');const [n,setN]=useState('10');
 const save=async()=>{if(!t.trim())return Alert.alert('Titre requis');await api.addExam(t,parseInt(n)||10);navigation.goBack();};
 return <ScrollView contentContainerStyle={{padding:16}} keyboardShouldPersistTaps="handled"><Text>Titre</Text><TextInput style={inp} value={t} onChangeText={setT}/><Text>Nombre de questions</Text><TextInput style={inp} value={n} onChangeText={setN} keyboardType="numeric"/><Button title="Enregistrer" onPress={save}/></ScrollView>;}
export function ManageUsers(){const {d}=useList(api.users);if(!d)return <Loading/>;
 return <FlatList data={d} keyExtractor={u=>u.id} contentContainerStyle={{padding:16,gap:10}} renderItem={({item})=><Row title={item.name} sub={`Niveau : ${item.level}`} badge={item.role==='admin'?'Admin':'Élève'}/>}/>;}
