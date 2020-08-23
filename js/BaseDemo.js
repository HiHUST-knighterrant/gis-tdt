var token = 'ed85cb054c588ff6a624b0cd3df49ef9';
      // 服务域名
      var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
      // 服务负载子域
      var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
      var imgMap = new Cesium.UrlTemplateImageryProvider({
        url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
        subdomains: subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18,
      })
      // cesium 初始化
      var viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate: true,
        selectionIndicator: true,
        infoBox: false,
        imageryProvider: imgMap,
      })
 
      // 抗锯齿
      viewer.scene.postProcessStages.fxaa.enabled = false
      // 水雾特效
      viewer.scene.globe.showGroundAtmosphere = true
      // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
      viewer.scene.screenSpaceCameraController.constrainedPitch = Cesium.Math.toRadians(
        -20
      )
      // 取消默认的双击事件
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )
 
      // 叠加影像服务
 
      //viewer.imageryLayers.addImageryProvider(imgMap)
 
      // 叠加国界服务
      var iboMap = new Cesium.UrlTemplateImageryProvider({
        url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
        subdomains: subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 10,
      })
      viewer.imageryLayers.addImageryProvider(iboMap)
 
      // 叠加地形服务
      var terrainUrls = new Array()
 
      for (var i = 0; i < subdomains.length; i++) {
        var url =
          tdtUrl.replace('{s}', subdomains[i]) +
          'DataServer?T=elv_c&tk=' +
          token
        terrainUrls.push(url)
      }
 
      var provider = new Cesium.GeoTerrainProvider({
        urls: terrainUrls,
      })
 
      viewer.terrainProvider = provider
 
      // 将三维球定位到中国
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
        orientation: {
          heading: Cesium.Math.toRadians(348.4202942851978),
          pitch: Cesium.Math.toRadians(-89.74026687972041),
          roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
          // 定位完成之后的回调函数
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(114.1114488, 22.588608, 10000),
            orientation: {
              heading: Cesium.Math.toRadians(348.4202942851978),
              pitch: Cesium.Math.toRadians(-89.74026687972041),
              roll: Cesium.Math.toRadians(0),
            },
            complete:function callback(){
              //debugger
            }
          })
        },
      })

       //点击事件
       //viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
       viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(click){
        var ray = viewer.scene.camera.getPickRay(click.position);
        var cartesian = viewer.scene.globe.pick(ray,viewer.scene);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var lon = Cesium.Math.toDegrees(cartographic.longitude);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            console.log('lon:'+lon + ',lat:'+lat);
            //var positions = [Cesium.Cartographic.fromDegrees(lon,lat)]
            // Cesium.when(new Cesium.sampleTerrain(terrain,7,positions),function (updatedPositions) { 
    
            //          var dxgd = updatedPositions[0].height;
            //          var pp1 = new Cesium.Cartographic(lon,lat, dxgd);
            //          console.log(pp1);
    
    
            // });
        }
       },Cesium.ScreenSpaceEventType.LEFT_CLICK)
 
      // 叠加三维地名服务
      var wtfs = new Cesium.GeoWTFS({
        viewer,
        //三维地名服务，使用wtfs服务
        subdomains: subdomains,
        metadata: {
          boundBox: {
            minX: -180,
            minY: -90,
            maxX: 180,
            maxY: 90,
          },
          minLevel: 1,
          maxLevel: 20,
        },
        aotuCollide: true, //是否开启避让
        collisionPadding: [5, 10, 8, 5], //开启避让时，标注碰撞增加内边距，上、右、下、左
        serverFirstStyle: true, //服务端样式优先
        labelGraphics: {
          font: '28px sans-serif',
          fontSize: 28,
          fillColor: Cesium.Color.WHITE,
          scale: 0.5,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 5,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          showBackground: false,
          backgroundColor: Cesium.Color.RED,
          backgroundPadding: new Cesium.Cartesian2(10, 10),
          horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          eyeOffset: Cesium.Cartesian3.ZERO,
          pixelOffset: new Cesium.Cartesian2(0, 8),
        },
        billboardGraphics: {
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          eyeOffset: Cesium.Cartesian3.ZERO,
          pixelOffset: Cesium.Cartesian2.ZERO,
          alignedAxis: Cesium.Cartesian3.ZERO,
          color: Cesium.Color.WHITE,
          rotation: 0,
          scale: 1,
          width: 18,
          height: 18,
        },
      })
 
      //三维地名服务，使用wtfs服务
      wtfs.getTileUrl = function () {
        return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&tk=' + token
      }
 
      wtfs.getIcoUrl = function () {
        return tdtUrl + 'mapservice/GetIcon?id={id}&tk=' + token
      }
 
      wtfs.initTDT([
        {
          x: 6,
          y: 1,
          level: 2,
          boundBox: { minX: 90, minY: 0, maxX: 135, maxY: 45 },
        },
        {
          x: 7,
          y: 1,
          level: 2,
          boundBox: { minX: 135, minY: 0, maxX: 180, maxY: 45 },
        },
        {
          x: 6,
          y: 0,
          level: 2,
          boundBox: { minX: 90, minY: 45, maxX: 135, maxY: 90 },
        },
        {
          x: 7,
          y: 0,
          level: 2,
          boundBox: { minX: 135, minY: 45, maxX: 180, maxY: 90 },
        },
        {
          x: 5,
          y: 1,
          level: 2,
          boundBox: { minX: 45, minY: 0, maxX: 90, maxY: 45 },
        },
        {
          x: 4,
          y: 1,
          level: 2,
          boundBox: { minX: 0, minY: 0, maxX: 45, maxY: 45 },
        },
        {
          x: 5,
          y: 0,
          level: 2,
          boundBox: { minX: 45, minY: 45, maxX: 90, maxY: 90 },
        },
        {
          x: 4,
          y: 0,
          level: 2,
          boundBox: { minX: 0, minY: 45, maxX: 45, maxY: 90 },
        },
        {
          x: 6,
          y: 2,
          level: 2,
          boundBox: { minX: 90, minY: -45, maxX: 135, maxY: 0 },
        },
        {
          x: 6,
          y: 3,
          level: 2,
          boundBox: { minX: 90, minY: -90, maxX: 135, maxY: -45 },
        },
        {
          x: 7,
          y: 2,
          level: 2,
          boundBox: { minX: 135, minY: -45, maxX: 180, maxY: 0 },
        },
        {
          x: 5,
          y: 2,
          level: 2,
          boundBox: { minX: 45, minY: -45, maxX: 90, maxY: 0 },
        },
        {
          x: 4,
          y: 2,
          level: 2,
          boundBox: { minX: 0, minY: -45, maxX: 45, maxY: 0 },
        },
        {
          x: 3,
          y: 1,
          level: 2,
          boundBox: { minX: -45, minY: 0, maxX: 0, maxY: 45 },
        },
        {
          x: 3,
          y: 0,
          level: 2,
          boundBox: { minX: -45, minY: 45, maxX: 0, maxY: 90 },
        },
        {
          x: 2,
          y: 0,
          level: 2,
          boundBox: { minX: -90, minY: 45, maxX: -45, maxY: 90 },
        },
        {
          x: 0,
          y: 1,
          level: 2,
          boundBox: { minX: -180, minY: 0, maxX: -135, maxY: 45 },
        },
        {
          x: 1,
          y: 0,
          level: 2,
          boundBox: { minX: -135, minY: 45, maxX: -90, maxY: 90 },
        },
        {
          x: 0,
          y: 0,
          level: 2,
          boundBox: { minX: -180, minY: 45, maxX: -135, maxY: 90 },
        },
      ])

     
