import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
// sections
import awsIcon from '@iconify/icons-logos/aws';
import azureIcon from '@iconify/icons-logos/azure';
import savingsIcon from '@iconify/icons-ic/baseline-attach-money';
import expensesIcon from '@iconify/icons-ic/baseline-money-off';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import Iconify from '../components/iconify';
import { useAuth } from '../context/AuthContext';

// ----------------------------------------------------------------------


export default function DashboardAppPage() {
  const theme = useTheme();
  const {currentUser,getCurrentUser} = useAuth()
  const awsCount=currentUser.ec2Instances.length+currentUser.s3Buckets.length;
  const azureCount = currentUser.storageAccounts.length;

  const runningInstances = () => {
    let count = 0
    let ncount=0
    currentUser.ec2Instances.forEach((val)=>{
      if(val.status !== 'terminated' && val.status !== "stopped") count+=1;
      else ncount+=1;
    })
    currentUser.s3Buckets.forEach((val)=>{
      if(val.status !== false) count+=1
      else ncount+=1;
    })
    return {count,ncount}
  }

  const chartData = [
    {
      name: 'S3 Buckets',
      data: currentUser.s3Buckets.map(bucket => ({ x: bucket.name, y: new Date(bucket.launchTime).getTime() })),
    },
    {
      name: 'Storage Accounts',
      data: currentUser.storageAccounts.map(account => ({ x: account.name, y: new Date(account.launchTime).getTime() })),
    },
    {
      name: 'EC2 Instances',
      data: currentUser.ec2Instances.map(instance => ({ x: instance.instanceName, y: new Date(instance.launchTime).getTime() })),
    },
  ];

  console.log(chartData)

 

  useEffect(()=>{
    getCurrentUser()
  },[])

  return (
    <>
      <Helmet>
        <title> Dashboard | Cloud Convergence CCP </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="AWS Resources" total={currentUser?.ec2Instances.length + currentUser?.s3Buckets.length} icon={awsIcon} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Azure Resources" total={currentUser?.storageAccounts.length } color="info" icon={azureIcon} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Amount Saved" total={(currentUser?.ec2Instances.length + currentUser?.s3Buckets.length + currentUser?.storageAccounts.length) === 0 ? '0%' : "8%"} color="warning" icon={savingsIcon} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Amount Spent" total={(currentUser?.ec2Instances.length + currentUser?.s3Buckets.length + currentUser?.storageAccounts.length) === 0 ? '0%' : "234$"} color="error" icon={expensesIcon} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
          <AppWebsiteVisits
        title="Resource Launch Times"
        subheader="Launch times for S3 Buckets, Storage Accounts, and EC2 Instances"
        chartLabels={[]}
        chartData={chartData}
      />
</Grid>


          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Resource Deployed"
              chartData={[
                { label: 'AWS', value: awsCount },
                { label: 'Azure', value: azureCount },
            
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Instance Status"
              chartData={[
                { label: 'Running', value: runningInstances().count },
                { label: 'Stopped/Terminated', value: runningInstances().ncount },
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
