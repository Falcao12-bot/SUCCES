import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Welcome, Login, Register, Forgot } from '../screens/Auth';
import * as S from '../screens/Student';
import EditorScreen from '../editor/EditorScreen';
import { colors } from '../theme';
const Stack=createNativeStackNavigator();const Tab=createBottomTabNavigator();
const icons:Record<string,string>={Home:'home',Courses:'book',Exercises:'create',ExamsTab:'document-text',Profile:'person'};
function Tabs(){return <Tab.Navigator screenOptions={({route})=>({headerShown:route.name!=='Home',tabBarActiveTintColor:colors.primary,tabBarLabelStyle:{fontSize:10},tabBarStyle:{height:62,paddingBottom:8,paddingTop:6},tabBarIcon:({color,size})=><Ionicons name={icons[route.name] as any} size={size} color={color}/>})}>
 <Tab.Screen name="Home" component={S.Home} options={{title:'Accueil'}}/><Tab.Screen name="Courses" component={S.Courses} options={{title:'Cours'}}/>
 <Tab.Screen name="Exercises" component={S.Exercises} options={{title:'Exercices'}}/><Tab.Screen name="ExamsTab" component={S2.ExamList} options={{title:'Examens'}}/><Tab.Screen name="Profile" component={S.Profile} options={{title:'Profil'}}/></Tab.Navigator>;}
import * as S2 from '../screens/Student2';
import * as A from '../screens/Admin';
export default function Navigation(){return <NavigationContainer><Stack.Navigator screenOptions={{animation:'slide_from_right'}}>
 <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}}/><Stack.Screen name="Login" component={Login} options={{title:'Connexion'}}/>
 <Stack.Screen name="Register" component={Register} options={{title:'Inscription'}}/><Stack.Screen name="Forgot" component={Forgot} options={{title:'Mot de passe oublié'}}/>
 <Stack.Screen name="Main" component={Tabs} options={{headerShown:false}}/><Stack.Screen name="Chapters" component={S.Chapters} options={({route}:any)=>({title:route.params.subject.title})}/>
 <Stack.Screen name="Lesson" component={S.LessonScreen} options={{title:'Leçon'}}/><Stack.Screen name="Admin" component={A.Dashboard} options={{title:'Administration',headerBackVisible:false}}/>
 <Stack.Screen name="AdminCourses" component={A.ManageCourses} options={{title:'Gestion des cours'}}/><Stack.Screen name="NewExercise" component={A.NewExercise} options={{title:'Nouvel exercice'}}/><Stack.Screen name="NewExam" component={A.NewExam} options={{title:'Nouvel examen'}}/><Stack.Screen name="AdminExercises" component={A.ManageExercises} options={{title:'Exercices'}}/>
 <Stack.Screen name="AdminExams" component={A.ManageExams} options={{title:'Examens'}}/><Stack.Screen name="AdminUsers" component={A.ManageUsers} options={{title:'Utilisateurs'}}/>
 <Stack.Screen name="ExamList" component={S2.ExamList} options={{title:'Examens'}}/><Stack.Screen name="Exam" component={S2.Exam} options={({route}:any)=>({title:route.params.title})}/>
 <Stack.Screen name="ExamResult" component={S2.ExamResult} options={{title:'Résultat',headerBackVisible:false}}/><Stack.Screen name="Progress" component={S2.Progress} options={{title:'Ma progression'}}/>
 <Stack.Screen name="Favorites" component={S2.Favorites} options={{title:'Favoris'}}/><Stack.Screen name="Settings" component={S2.Settings} options={{title:'Paramètres'}}/>
 <Stack.Screen name="LessonList" component={S.LessonList} options={({route}:any)=>({title:route.params.chapter.title})}/>
 <Stack.Screen name="AI" component={S.AI} options={{title:'IA Éducative'}}/>
 <Stack.Screen name="Editor" component={EditorScreen} options={{title:'Nouveau cours'}}/></Stack.Navigator></NavigationContainer>;}
