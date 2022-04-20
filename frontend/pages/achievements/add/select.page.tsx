import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonBase, Checkbox, Container, Stack, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { AchievementResume, IAchievementResume } from "../components/AchievementResume";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { RadioButtonUnchecked } from "@mui/icons-material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from "react";

interface ICheckedState {
  [key: string]: boolean;
}

const Page: NextPage = () => {
  const [ checked, setChecked ] = useState<ICheckedState>({});
  const handleSetChecked = (id: string) => {
    setChecked({
      ...checked,
      [id]: !checked[id]
    });
  }
  const totalChecked = Object.keys(checked).filter(key => checked[key]).length;
  return (
    <Container maxWidth='md'>
      <Box display='flex' justifyContent='center' flexDirection='column'>
        <Typography variant='h5' textAlign='center' my={4}>Select achievements</Typography>
        <TextField label='Search' />
      </Box>
      <Box py={4}>
        {exampleGamesData.map(game => (
          <Accordion key={game.id}>
            <AccordionSummary>
              <Typography>{game.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={0} py={4}>
                {game.achievements.map((achievement, index) => (
                  <ButtonBase sx={{display:'block'}} onClick={()=>{handleSetChecked(`${game.id}-${achievement.id}`)}} key={index}>
                    <Box py={2}>
                      <AchievementResume {...achievement} image={achievement.image+'?'+`${game.id}-${achievement.id}`}>
                        <Checkbox checked={checked[`${game.id}-${achievement.id}`] === true} icon={<RadioButtonUnchecked />} checkedIcon={<CheckCircleIcon />}/>
                      </AchievementResume>
                    </Box>
                  </ButtonBase>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Button disabled={totalChecked === 0} variant='contained' fullWidth>Mint {totalChecked} <EmojiEventsIcon/></Button>
    </Container>
  )
}

export default Page

const exampleData: IAchievementResume[] = [
  {
    id: '1',
    title: "Achievement 1",
    description: "Kill a monster",
    image: "https://source.unsplash.com/random",
  },
  {
    id: '2',
    title: "Achievement 2",
    description: "Fully explore the map",
    image: "https://source.unsplash.com/random",
  },
  {
    id: '3',
    title: "Achievement 3",
    description: "Kill all of the monsters",
    image: "https://source.unsplash.com/random",
  },
  {
    id: '4',
    title: "Achievement 4",
    description: "Find a new map",
    image: "https://source.unsplash.com/random",
  },
  {
    id: '5',
    title: "Achievement 5",
    description: "Find all maps",
    image: "https://source.unsplash.com/random",
  },
  {
    id: '6',
    title: "Achievement 6",
    description: "Matar a todos los zombies",
    image: "https://source.unsplash.com/random",
  },
]



const exampleGamesData = [
  {
    id: '1',
    title: 'CS GO',
    achievements: exampleData
  },
  {
    id: '2',
    title: 'Sifu',
    achievements: exampleData
  },
  {
    id: '3',
    title: 'Fortnite',
    achievements: exampleData
  }
]