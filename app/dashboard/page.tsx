'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Folder, File, Trash, Download } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const [files, setFiles] = useState([
    { id: 1, name: 'Document.pdf', type: 'file', size: '2.5 MB' },
    { id: 2, name: 'Images', type: 'folder', size: '-- MB' },
    { id: 3, name: 'Presentation.pptx', type: 'file', size: '5.1 MB' },
  ])
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Simulating file upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        // Add uploaded file to the list (in a real app, this would come from the server)
        setFiles(prev => [...prev, { id: Date.now(), name: 'New File.txt', type: 'file', size: '1.0 MB' }])
        setUploadProgress(0)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <header className="bg-white bg-opacity-90 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Telegram Cloud Storage</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <Input type="file" className="w-64" onChange={handleFileUpload} />
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </div>
          {uploadProgress > 0 && (
            <div className="mb-4">
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{file.type === 'folder' ? <Folder className="h-4 w-4 text-blue-500" /> : <File className="h-4 w-4 text-green-500" />}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

