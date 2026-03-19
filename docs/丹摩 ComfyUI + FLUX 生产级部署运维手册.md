丹摩 ComfyUI + FLUX 生产级部署运维手册
适用环境：NVIDIA RTX 4090 (24GB) / Ubuntu 24.04 / Python 3.12 / CUDA 12.8
架构核心：核心程序存入 /root（系统盘，用于制作轻量镜像），超大模型存入 /root/shared-storage（共享持久盘，不占镜像空间）。

第一部分：基础环境与核心依赖安装
进入系统盘根目录并拉取 ComfyUI 源码：

Bash
cd /root [cite: 1]
git clone https://github.com/comfyanonymous/ComfyUI.git [cite: 1]
cd ComfyUI [cite: 1]
创建独立 Python 虚拟环境：

Bash
python3 -m venv venv [cite: 2]
source venv/bin/activate [cite: 2]
极速安装适配 CUDA 12.8 的底层库与依赖：

Bash
pip install --upgrade pip [cite: 2]
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124 [cite: 2]
pip install -r requirements.txt [cite: 2]
第二部分：FLUX 大模型下载与持久化存储
为了保证模型不丢失且不撑爆镜像，我们在共享存储中建立专属仓库。

建立共享存储模型目录：

Bash
mkdir -p /root/shared-storage/comfyui_models/unet [cite: 1]
mkdir -p /root/shared-storage/comfyui_models/vae [cite: 1]
mkdir -p /root/shared-storage/comfyui_models/clip [cite: 1]
使用内网高速通道下载 FLUX 模型并解压：

Bash
cd /root/workspace/ [cite: 3]
wget http://file.s3/damodel-openfile/FLUX.1/FLUX.1-dev.tar [cite: 2]
wget http://file.s3/damodel-openfile/FLUX.1/flux_text_encoders.tar [cite: 3]
tar -xf FLUX.1-dev.tar [cite: 3, 4]
tar -xf flux_text_encoders.tar [cite: 4]
将解压后的核心文件转移至共享存储：

Bash
mv flux1-dev.safetensors /root/shared-storage/comfyui_models/unet/ [cite: 4]
mv ae.safetensors /root/shared-storage/comfyui_models/vae/ [cite: 5]
mv t5xxl_fp8_e4m3fn.safetensors /root/shared-storage/comfyui_models/clip/ [cite: 5]
mv clip_l.safetensors /root/shared-storage/comfyui_models/clip/ [cite: 5]
第三部分：打通架构的“软链接”桥梁
这一步是整个系统架构的灵魂，让系统盘的程序读取共享盘的模型。

清理自带的空文件夹（防冲突）：

Bash
cd /root/ComfyUI/models [cite: 7]
rm -rf unet vae clip [cite: 8]
建立跨盘软链接：

Bash
ln -s /root/shared-storage/comfyui_models/unet /root/ComfyUI/models/unet [cite: 8]
ln -s /root/shared-storage/comfyui_models/vae /root/ComfyUI/models/vae [cite: 8]
ln -s /root/shared-storage/comfyui_models/clip /root/ComfyUI/models/clip [cite: 8]
第四部分：核心插件 (Manager) 的代理安装
针对国内服务器访问 GitHub 报错的网络阻断问题，采用镜像源加速拉取。

进入插件目录并使用代理源克隆：

Bash
cd /root/ComfyUI/custom_nodes [cite: 16]
git clone https://ghproxy.cn/https://github.com/ltdrdata/ComfyUI-Manager.git [cite: 17]
第五部分：日常运维与服务控制 (排障必杀技)
在你日常调试或重装插件时，最常遇到端口被占或数据库死锁，以下是标准清理和启动流程。

清理幽灵进程与端口（杀进程双保险）：

Bash
pkill -9 -f "main.py" [cite: 19]
fuser -k 8188/tcp [cite: 19]
启动生产级 API 监听服务：

Bash
source /root/ComfyUI/venv/bin/activate [cite: 19]
cd /root/ComfyUI [cite: 19]
python main.py --listen 0.0.0.0 --port 8188 --highvram --enable-cors-header [cite: 19]
第六部分：保存镜像前的“封箱操作”
当你准备去丹摩控制台点击“保存镜像”时，务必先在终端执行以下瘦身命令：

Bash
# 彻底关停所有运行中的 ComfyUI 服务
pkill -9 -f "main.py" [cite: 19]
fuser -k 8188/tcp [cite: 19]

# 深度清理 pip 缓存，大幅缩减镜像体积
rm -rf /root/.cache/pip [cite: 19]

# 同步保存本次所有操作命令
history -a [cite: 19]
history > /root/workspace/my_commands_20260311.txt [cite: 19, 20]