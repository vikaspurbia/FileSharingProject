
import './App.css';
import CustomBox from './component/autoComplete/custom';
import top100Films from './component/autoComplete/films';
import FileUpload from './component/fileUpload/file';
import UserForm from './component/form';
import FormDisplay from './component/FormDisplay';

function App() {
  return (
    <div className="App">
{/* <UserForm/>

<FormDisplay/> */}

{/* <CustomBox 
        films={top100Films} 
        styling={{ backgroundColor: 'lightblue', borderRadius: '8px' }} 
      /> */}


 <FileUpload/> 




    </div>
  );
}

export default App;
