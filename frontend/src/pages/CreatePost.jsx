import { useState } from "react"
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from "../utils"
import { FormField, Loader } from '../components'

const CreatePost = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    size: '1024x1024',
    photo: '',
  })
  const [generatingImg, setGeneratingImg] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        await response.json();
        alert('Success');
        navigate('/')
      } catch (err) {
        alert(err);
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]:e.target.value })
  }

  const handleSurpriseMe = (e) => {
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({ ...form, prompt: randomPrompt })
  }

  const generateImage = async () => {
    if(!form.name) {
      return alert('please enter a name')
    }

    if(form.prompt) {
      try {
        console.log('generating image');
        setGeneratingImg(true)

        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt, size: form.size }),
        })

        const data = await response.json()
        console.log(data);

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}`})
        console.log('image has been generated', `dataLimage/jpeg;base64,${data.photo}`);
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false)   
      }
    } else {
      alert('please enter a prompt');
    }

  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through DALL-E AI and share it with the community</p>
      </div>

      <form className="mt-16 max-w-3x1" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField 
            labelName="Your name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField 
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A plush toy robot sitting against a yellow wall"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}            
          />
          <label htmlFor="size" className="block text-sm font-medium text-gray-900">Choose a size:</label>
          <select name="size" id="size" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#6469ff] focus:border-[#6469ff] outline-none block w-full p-3">
            <option value='1024x1024'>1024x1024</option>
            <option value='512x512'>512x512</option>
            <option value='256x256'>256x256</option>
          </select>
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : ( 
              <img 
                src={preview} 
                alt="preview" 
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button 
            type="button"
            onClick={generateImage}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
          <button 
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>

      </form>
    </section>
  )
}

export default CreatePost