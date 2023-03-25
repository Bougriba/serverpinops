import { useState } from 'react';

function ApplyForm() {
  const [pdfFile, setPdfFile] = useState(null);
  const [skills, setSkills] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission, e.g. send data to server
  }

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  }

  const handleSkillsChange = (event) => {
    setSkills(event.target.value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pdf-file">Upload your PDF file:</label>
        <input type="file" id="pdf-file" name="pdf-file" onChange={handleFileChange} /><br /><br />
        <label htmlFor="skills">Type your skills:</label>
        <textarea id="skills" name="skills" value={skills} onChange={handleSkillsChange}></textarea><br /><br />
        <label htmlFor="skills">Type your Major:</label>
        <textarea id="skills" name="major" value={skills} onChange={handleSkillsChange}></textarea><br /><br />
        <label htmlFor="skills">Type your Degree:</label>
        <textarea id="skills" name="Degree" value={skills} onChange={handleSkillsChange}></textarea><br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default ApplyForm