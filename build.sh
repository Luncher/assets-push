#!/bin/sh

tag="$(date +%Y%m%d%H%M%S)"
if [[ $1 ]]; then
	tag=$1
fi

imageName='xlgg-assets-push'

if [[ $2 ]]; then
  echo $2
  imageName="$imageName-$2"
fi

echo $imageName

# daocloudImage='daocloud.io/baidao/'${imageName}':'${tag}
aliImage='registry.cn-shanghai.aliyuncs.com/ytx-zq/'${imageName}':'${tag}
aliImage1='registry.cn-shanghai.aliyuncs.com/ytx-zq/'${imageName}':latest'

# docker login -p ${DAOCLOUD_PASSWORD} -u ${DAOCLOUD_USERNAME} -e developer@baidao.com daocloud.io
docker login -p ${ALIYUN_PASSWORD} -u ${ALIYUN_USERNAME} -e developer@baidao.com registry.cn-shanghai.aliyuncs.com

docker build -t ${imageName} .

# docker tag -f ${imageName} ${daocloudImage}
# docker push ${daocloudImage}

docker tag -f ${imageName} ${aliImage}
docker push ${aliImage}

docker tag -f ${imageName} ${aliImage1}
docker push ${aliImage1}