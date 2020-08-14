using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectCore.Modules.File
{
    public class Image
    {
        private readonly Repository _repository;

        public Image(Repository repository)
        {
            _repository = repository;
        }

        public async Task<Model.Image.GetModel.Output> Get(Model.Image.GetModel.Input input)
        {
            var file = await _repository.GetQuery(input.Id).FirstOrDefaultAsync();
            if (file == null)
                file = _repository.imageDefault;

            var imageOutput = new Model.Image.GetModel.Output
            {
                FilePath = Path.Combine(_repository.dataFilePath, file.Name),
                FileType = file.FileType,
            };

            if (input.Size >= 2048)
                imageOutput = Resize(file, 2048, input.Square);
            else if (input.Size >= 1536)
                imageOutput = Resize(file, 1536, input.Square);
            else if (input.Size >= 1024)
                imageOutput = Resize(file, 1024, input.Square);
            else if (input.Size >= 768)
                imageOutput = Resize(file, 768, input.Square);
            else if (input.Size >= 512)
                imageOutput = Resize(file, 512, input.Square);
            else if (input.Size >= 384)
                imageOutput = Resize(file, 384, input.Square);
            else if (input.Size >= 256)
                imageOutput = Resize(file, 256, input.Square);
            else if (input.Size >= 128)
                imageOutput = Resize(file, 128, input.Square);
            else if (input.Size >= 64)
                imageOutput = Resize(file, 64, input.Square);

            return imageOutput;
        }

        Model.Image.GetModel.Output Resize(Models.File file, int size, bool square = false)
        {
            var filePath = Path.Combine(_repository.dataFilePath, file.Name);
            var tempPath = Path.Combine(_repository.dataImageTempPath, size.ToString());
            var fileTempPath = Path.Combine(tempPath, square ? file.Name.Replace(".", "_square.") : file.Name);

            if (System.IO.File.Exists(fileTempPath) == false)
            {
                using (Image<Rgba32> image = SixLabors.ImageSharp.Image.Load<Rgba32>(filePath))
                {
                    CreateFolderByPath(tempPath);

                    var resizeOption = new ResizeOptions();
                    int width = size, height = size;

                    if (square)
                    {
                        resizeOption.Mode = ResizeMode.Pad;
                    }
                    else
                    {
                        resizeOption.Mode = ResizeMode.Max;

                        if (image.Width <= width && image.Height <= height)
                        {
                            width = image.Width;
                            height = image.Height;
                        }
                    }

                    resizeOption.Size = new Size(width, height);

                    //image.Mutate(x => x.Resize(resizeOption).BackgroundColor(new Rgb24(255,255,255)).AutoOrient());
                    image.Mutate(x => x.Resize(resizeOption).AutoOrient());

                    image.Save(fileTempPath);
                }
            }

            return new Model.Image.GetModel.Output
            {
                FilePath = fileTempPath,
                FileType = file.FileType,
            };
        }

        public void CreateFolderByPath(string folderPath)
        {
            string[] folderList = folderPath.Trim().Split('/');
            for (int i = 0; i < folderList.Length; i++)
            {
                if (folderList[i] != "")
                {
                    string relPath = folderList[0];
                    for (int j = 1; j <= i; j++)
                        relPath += "/" + folderList[j];
                    string absPath = Path.Combine(relPath);

                    if (Directory.Exists(absPath) == false)
                        Directory.CreateDirectory(absPath);
                }
            }
        }
    }
}
